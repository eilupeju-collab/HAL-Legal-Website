import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, LiveSession } from "@google/genai";

// --- Configuration ---
const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-12-2025';

const SYSTEM_INSTRUCTION = `You are HAL, the Voice Assistant for HAL Legal Consult.

CORE IDENTITY:
- You are a professional, empathetic legal intake agent.
- You speak clearly and concisely (1-2 sentences per turn).
- You strictly rely on real data via tools; never guess.

BOOKING FLOW (Trigger: User wants to book, meet, or consult):
Follow this strict sequence. Ask ONE question at a time. Do not group questions.
1. **Goal**: Ask for the primary reason for the visit if not known.
2. **Preference**: Ask if they prefer a "Virtual" or "In-Person" consultation.
3. **Availability**: Ask for a preferred date (e.g. "What day works best?"), then IMMEDIATELY call 'checkAvailability'.
4. **Selection**: Read out available slots from the tool result and ask the user to pick one.
5. **Form Trigger**: Once a slot is picked, DO NOT ask for name/email verbally. Instead, say "I'll pull up the secure booking form for you to finalize the details." and IMMEDIATELY call the 'triggerIntakeForm' tool.
6. **Confirmation**: After the user submits the form (you will receive a text message with their details), call 'bookAppointment' with the provided details.
7. **Closing**: Confirm the booking success to the user.

TOOLS & DATA:
- Address/Directions -> Call 'getOfficeLocation'.
- Hours -> Call 'getBusinessHours'.
- Schedule -> Call 'checkAvailability'.
- Intake/Booking -> Call 'triggerIntakeForm'.
- Finalize Booking -> Call 'bookAppointment'.

SAFETY:
- Do not provide legal advice.
- If unsure, offer to have a human lawyer call them back.
`;

// --- Tool Definitions ---
const getOfficeLocationTool: FunctionDeclaration = {
  name: "getOfficeLocation",
  description: "Retrieve the physical address and location directions for the law firm office.",
  parameters: { type: Type.OBJECT, properties: {} },
};

const getBusinessHoursTool: FunctionDeclaration = {
  name: "getBusinessHours",
  description: "Retrieve the daily opening and closing hours of the law firm.",
  parameters: { type: Type.OBJECT, properties: {} },
};

const checkAvailabilityTool: FunctionDeclaration = {
  name: "checkAvailability",
  description: "Check the calendar for available appointment slots.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: "The date (e.g., 'tomorrow', 'Friday')." },
    },
    required: ["date"],
  },
};

const triggerIntakeFormTool: FunctionDeclaration = {
  name: "triggerIntakeForm",
  description: "Display the user intake form on the screen to collect name, email, and issue details.",
  parameters: { type: Type.OBJECT, properties: {} },
};

const bookAppointmentTool: FunctionDeclaration = {
  name: "bookAppointment",
  description: "Book a consultation appointment.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING },
      time: { type: Type.STRING },
      clientName: { type: Type.STRING },
      clientEmail: { type: Type.STRING },
      visitType: { type: Type.STRING, description: "Virtual or In-Person" },
      issueType: { type: Type.STRING },
    },
    required: ["date", "time", "clientName"],
  },
};

const tools = [{ functionDeclarations: [getOfficeLocationTool, getBusinessHoursTool, checkAvailabilityTool, triggerIntakeFormTool, bookAppointmentTool] }];

// --- Mock Data & Logic ---
const MOCK_DB = {
  address: "101 Legal Avenue, Suite 500, New York, NY 10001",
  hours: "Monday to Friday, 9:00 AM to 6:00 PM EST.",
};

async function executeLocalTool(name: string, args: any) {
  console.log(`[Tool] Executing ${name}`, args);
  if (name === "getOfficeLocation") {
    return { address: MOCK_DB.address, notes: "Located near the Federal Courthouse. Valet parking available at the main entrance." };
  }
  if (name === "getBusinessHours") {
    return { hours: MOCK_DB.hours, notes: "After-hours support is available for emergencies via the hotline." };
  }
  if (name === "checkAvailability") {
    // Simulate real-time logic
    return { 
      status: "available", 
      slots: ["10:00 AM", "2:00 PM", "4:30 PM"],
      message: "I have openings at 10:00 AM, 2:00 PM, and 4:30 PM."
    };
  }
  if (name === "triggerIntakeForm") {
    return { status: "displayed", message: "Form is now visible to the user." };
  }
  if (name === "bookAppointment") {
    return { 
      status: "confirmed", 
      confirmationId: "HAL-VOICE-" + Math.floor(Math.random() * 1000), 
      message: "Appointment secured in CRM pending attorney review." 
    };
  }
  return { error: "Unknown tool" };
}

// --- Audio Utilities ---
function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return output.buffer;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export interface UserContext {
  name: string;
  email: string;
  issue: string;
}

// --- Live Client Class ---
export class LiveClient {
  private ai: GoogleGenAI;
  private session: LiveSession | null = null;
  private inputContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextStartTime = 0;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  
  public onStatusChange: (status: string) => void = () => {};
  public onVolumeLevel: (level: number) => void = () => {}; // 0 to 1
  public onShowForm: () => void = () => {};

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async connect(userData?: UserContext) {
    this.onStatusChange("connecting");

    // 1. Setup Audio Contexts
    this.inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    // 2. Start Microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    let finalInstruction = SYSTEM_INSTRUCTION;
    if (userData) {
      finalInstruction += `\n\nCURRENT USER CONTEXT:\nName: ${userData.name}\nEmail: ${userData.email}\nInquiry Topic: ${userData.issue}\n\nINSTRUCTION: Greet the user by name immediately and acknowledge their inquiry topic.`;
    }

    // 3. Connect to Gemini Live
    const sessionPromise = this.ai.live.connect({
      model: MODEL_NAME,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Professional voice
        },
        systemInstruction: { parts: [{ text: finalInstruction }] },
        tools: tools,
      },
      callbacks: {
        onopen: () => {
          this.onStatusChange("connected");
          this.startAudioInput(stream, sessionPromise);
        },
        onmessage: async (msg: LiveServerMessage) => {
          this.handleServerMessage(msg, sessionPromise);
        },
        onclose: () => {
          this.onStatusChange("disconnected");
        },
        onerror: (err) => {
          console.error("Live API Error:", err);
          this.onStatusChange("error");
        }
      }
    });
    
    // Assign session for later cleanup, though mainly we use sessionPromise in callbacks
    this.session = await sessionPromise;
  }

  private startAudioInput(stream: MediaStream, sessionPromise: Promise<LiveSession>) {
    if (!this.inputContext) return;

    this.inputSource = this.inputContext.createMediaStreamSource(stream);
    this.processor = this.inputContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate volume level for UI
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
      const rms = Math.sqrt(sum / inputData.length);
      this.onVolumeLevel(Math.min(1, rms * 5)); // Amplify for visual

      // Convert to PCM16
      const pcm16 = floatTo16BitPCM(inputData);
      
      // Send to model
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcm16)));
      
      sessionPromise.then(session => {
        session.sendRealtimeInput({
          media: {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Data
          }
        });
      });
    };

    this.inputSource.connect(this.processor);
    this.processor.connect(this.inputContext.destination);
  }

  private async handleServerMessage(message: LiveServerMessage, sessionPromise: Promise<LiveSession>) {
    // 1. Handle Audio Output
    const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      if (!this.outputContext) return;
      
      // Decode PCM
      const audioBytes = base64ToUint8Array(audioData);
      const audioBuffer = await this.decodeAudio(audioBytes);
      
      // Schedule Playback
      this.playAudioBuffer(audioBuffer);
    }

    // 2. Handle Interruption
    if (message.serverContent?.interrupted) {
      this.stopAllAudio();
    }

    // 3. Handle Tool Calls
    if (message.toolCall) {
      this.onStatusChange("processing");
      for (const call of message.toolCall.functionCalls) {
        // Special Client Trigger
        if (call.name === "triggerIntakeForm") {
             this.onShowForm();
        }

        const result = await executeLocalTool(call.name, call.args);
        
        sessionPromise.then(session => {
          session.sendToolResponse({
            functionResponses: {
              id: call.id,
              name: call.name,
              response: { result: result }
            }
          });
        });
      }
      this.onStatusChange("connected");
    }
  }

  public async sendText(text: string) {
    if (this.session) {
        this.session.sendRealtimeInput({
            content: [{ parts: [{ text: text }] }]
        });
    }
  }

  private async decodeAudio(bytes: Uint8Array): Promise<AudioBuffer> {
    if (!this.outputContext) throw new Error("No output context");
    
    // Raw PCM decode for 24kHz 1 channel
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const buffer = this.outputContext.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);
    return buffer;
  }

  private playAudioBuffer(buffer: AudioBuffer) {
    if (!this.outputContext) return;

    const source = this.outputContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputContext.destination);
    
    const now = this.outputContext.currentTime;
    // Ensure we schedule after the previous chunk, or now if we fell behind
    const start = Math.max(now, this.nextStartTime);
    
    source.start(start);
    this.nextStartTime = start + buffer.duration;
    
    this.activeSources.add(source);
    source.onended = () => this.activeSources.delete(source);
  }

  private stopAllAudio() {
    this.activeSources.forEach(src => {
      try { src.stop(); } catch(e) {}
    });
    this.activeSources.clear();
    this.nextStartTime = 0;
  }

  async disconnect() {
    if (this.session) {
        this.session = null;
    }
    
    if (this.inputSource) this.inputSource.disconnect();
    if (this.processor) this.processor.disconnect();
    if (this.inputContext) await this.inputContext.close();
    if (this.outputContext) await this.outputContext.close();
    
    this.stopAllAudio();
  }
}