import QRCode from 'qrcode';

interface UserQRData {
  registrationId: string;
  name: string;
  email: string;
  eventName: string;
  checkInCode: string;
  timestamp: string;
}

export class QRCodeService {
  /**
   * Generate a unique registration ID based on user data
   */
  static generateRegistrationId(userData: { name: string; email: string }): string {
    const nameHash = userData.name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const emailHash = userData.email.split('@')[0].substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `TH2025-${nameHash}${emailHash}${randomNum}`;
  }

  /**
   * Generate a unique check-in code for the user
   */
  static generateCheckInCode(registrationId: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const hash = btoa(registrationId + timestamp).slice(0, 8).toUpperCase();
    return hash;
  }

  /**
   * Create QR code data object
   */
  static createQRData(userData: { name: string; email: string; registrationDate?: string }): UserQRData {
    const registrationId = this.generateRegistrationId(userData);
    const checkInCode = this.generateCheckInCode(registrationId);
    
    return {
      registrationId,
      name: userData.name,
      email: userData.email,
      eventName: 'TechHack 2025',
      checkInCode,
      timestamp: userData.registrationDate || new Date().toISOString()
    };
  }

  /**
   * Generate QR code as base64 data URL
   */
  static async generateQRCode(userData: { name: string; email: string; registrationDate?: string }): Promise<{
    qrCodeDataUrl: string;
    registrationId: string;
    checkInCode: string;
    qrData: UserQRData;
  }> {
    try {
      const qrData = this.createQRData(userData);
      
      // Create a JSON string with user information for the QR code
      const qrContent = JSON.stringify({
        id: qrData.registrationId,
        name: qrData.name,
        email: qrData.email,
        event: qrData.eventName,
        checkIn: qrData.checkInCode,
        timestamp: qrData.timestamp,
        type: 'TECHHACK2025_REGISTRATION'
      });

      // Generate QR code with high error correction and good size
      const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {
        errorCorrectionLevel: 'H', // High error correction
        margin: 1,
        color: {
          dark: '#000000',  // Black dots
          light: '#FFFFFF'  // White background
        },
        width: 256 // 256x256 pixels
      });

      return {
        qrCodeDataUrl,
        registrationId: qrData.registrationId,
        checkInCode: qrData.checkInCode,
        qrData
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate a simple text-based QR code for basic info
   */
  static async generateSimpleQR(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 200
      });
    } catch (error) {
      console.error('Error generating simple QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Decode QR data (for verification purposes)
   */
  static parseQRData(qrContent: string): UserQRData | null {
    try {
      const data = JSON.parse(qrContent);
      if (data.type === 'TECHHACK2025_REGISTRATION') {
        return {
          registrationId: data.id,
          name: data.name,
          email: data.email,
          eventName: data.event,
          checkInCode: data.checkIn,
          timestamp: data.timestamp
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  }
}