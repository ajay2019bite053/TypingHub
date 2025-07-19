// Types
export interface Certificate {
  _id: string;
  userId: string;
  name: string;
  issuedAt: string;
  certificateUrl: string;
  [key: string]: any;
}

export interface GenerateCertificateRequest {
  name: string;
  [key: string]: any;
}

const API_BASE = '/api/certificates';

const certificateService = {
  async generateCertificate(data: GenerateCertificateRequest) {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return res.json();
  },

  async downloadCertificate(certificateId: string) {
    const res = await fetch(`${API_BASE}/download/${certificateId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to download certificate');
    return res.blob();
  },

  async verifyCertificate(certificateId: string) {
    const res = await fetch(`${API_BASE}/verify/${certificateId}`, {
      method: 'GET',
      credentials: 'include',
    });
    return res.json();
  },

  async getUserCertificates() {
    const res = await fetch(`${API_BASE}/user`, {
      method: 'GET',
      credentials: 'include',
    });
    return res.json();
  },

  async getAllCertificates() {
    const res = await fetch(`${API_BASE}/all`, {
      method: 'GET',
      credentials: 'include',
    });
    return res.json();
  },
};

export default certificateService; 