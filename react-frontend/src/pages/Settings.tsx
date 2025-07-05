import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faGlobe,
  faShieldAlt,
  faEnvelope,
  faBell,
  faDatabase,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import './Settings.css';

interface EmailSettings {
  smtpServer: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  senderEmail: string;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpServer: 'smtp.typinghub.in',
    smtpPort: '587',
    smtpUsername: 'notifications@typinghub.in',
    smtpPassword: '',
    senderEmail: 'no-reply@typinghub.in'
  });

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '00:00',
    retentionDays: 30
  });

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackupSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setBackupSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>
          <FontAwesomeIcon icon={faCog} />
          System Settings
        </h1>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => setActiveTab('general')}
          >
            <FontAwesomeIcon icon={faGlobe} />
            General Settings
          </button>
          <button
            className={activeTab === 'security' ? 'active' : ''}
            onClick={() => setActiveTab('security')}
          >
            <FontAwesomeIcon icon={faShieldAlt} />
            Security Settings
          </button>
          <button
            className={activeTab === 'email' ? 'active' : ''}
            onClick={() => setActiveTab('email')}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            Email Settings
          </button>
          <button
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            <FontAwesomeIcon icon={faBell} />
            Notifications
          </button>
          <button
            className={activeTab === 'backup' ? 'active' : ''}
            onClick={() => setActiveTab('backup')}
          >
            <FontAwesomeIcon icon={faDatabase} />
            Backup & Restore
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'email' && (
            <div className="settings-section">
              <h2>Email Configuration</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>SMTP Server</label>
                  <input
                    type="text"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Port</label>
                  <input
                    type="text"
                    name="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Username</label>
                  <input
                    type="text"
                    name="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Password</label>
                  <input
                    type="password"
                    name="smtpPassword"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
                <div className="form-group">
                  <label>Sender Email</label>
                  <input
                    type="email"
                    name="senderEmail"
                    value={emailSettings.senderEmail}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="settings-section">
              <h2>Backup Configuration</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="autoBackup"
                      checked={backupSettings.autoBackup}
                      onChange={handleBackupSettingsChange}
                    />
                    Enable Automatic Backup
                  </label>
                </div>
                <div className="form-group">
                  <label>Backup Frequency</label>
                  <select
                    name="backupFrequency"
                    value={backupSettings.backupFrequency}
                    onChange={handleBackupSettingsChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Backup Time</label>
                  <input
                    type="time"
                    name="backupTime"
                    value={backupSettings.backupTime}
                    onChange={handleBackupSettingsChange}
                  />
                </div>
                <div className="form-group">
                  <label>Retention Period (Days)</label>
                  <input
                    type="number"
                    name="retentionDays"
                    value={backupSettings.retentionDays}
                    onChange={handleBackupSettingsChange}
                    min="1"
                    max="365"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button className="save-btn">
              <FontAwesomeIcon icon={faSave} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 