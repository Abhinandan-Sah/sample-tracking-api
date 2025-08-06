// Defines the shape of the data for creating a new sample.
// This is used for request body validation.
export interface AddSampleBody {
  patientName: string;
  sampleType: string;
  hospitalId: string;
  // In a real authenticated app, agentId would come from the token,
  // but we include it here for the initial setup.
  agentId: string;
}