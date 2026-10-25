import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cases: [
    { id: '#CA001', type: 'Procurement Fraud', name: 'Project Atlas Vendor Check', entities: 'Vendor: Acme Corp\nEmployee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Verified', riskLevel: 'High', status: 'Open', lastModified: '12/07/2022' },
    { id: '#CA002', type: 'Conflict of Interest', name: 'Priya Singh Conflict', entities: 'Employee: B. Patel\nEmployee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Suggested', riskLevel: 'High', status: 'Under Review', lastModified: '16/07/2022' },
    { id: '#CA003', type: 'Conflict of Interest', name: 'Quarter-End Sales Spikes', entities: '• Employee: Sharma\n• Acme Corp', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Verified', riskLevel: 'Medium', status: 'Open', lastModified: '12/06/2022' },
    { id: '#CA004', type: 'Conflict of Interest', name: 'Quarter-End Sales Check', entities: '• Employee: B. Patel\n• Employee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Suggested', riskLevel: 'Low', status: 'Closed', lastModified: '13/08/2022' },
    { id: '#CA005', type: 'Conflict of Interest', name: 'Quarter-End Sales Spikes', entities: 'Vendor: A. A.. A. Sharma\n• Employee: Acme Corp', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Verified', riskLevel: 'Medium', status: 'Under Review', lastModified: '12/06/2022' },
    { id: '#CA006', type: 'Insider Trading', name: 'Insider Trading Case', entities: '• Employee: B. Patel\n• Employee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Flagged', riskLevel: 'High', status: 'Open', lastModified: '12/06/2022' },
  ],
};

export const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    addCase: (state, action) => {
      state.cases.unshift(action.payload);
    },
  },
});

export const { addCase } = casesSlice.actions;
export default casesSlice.reducer;