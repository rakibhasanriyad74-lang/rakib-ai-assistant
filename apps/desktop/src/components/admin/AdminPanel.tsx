// Admin panel component
import { useState } from 'react';
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { Settings, RefreshCw, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminPanel.css';

export function AdminPanel() {
  const { config, isSyncing, error, lastSyncTime, manualSync, isInMaintenance } = useRemoteConfig();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'hotfixes' | 'settings'>('overview');
  const [showDebug, setShowDebug] = useState(false);

  const handleSync = async () => {
    try {
      await manualSync();
      toast.success('Config synced successfully');
    } catch (error) {
      toast.error('Failed to sync config');
    }
  };

  if (!config) {
    return (
      <div className="admin-panel admin-panel-loading">
        <div className="admin-loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-title">
          <Settings size={24} />
          <h1>Admin Control Panel</h1>
        </div>
        <div className="admin-header-actions">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="admin-btn admin-btn-primary"
            title="Sync remote config"
          >
            <RefreshCw size={18} className={isSyncing ? 'spinning' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="admin-btn admin-btn-secondary"
            title="Toggle debug info"
          >
            Debug
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="admin-status-bar">
        <div className="status-item">
          <span className="status-label">Version:</span>
          <span className="status-value">{config.version}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Last Sync:</span>
          <span className="status-value">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Never'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Maintenance:</span>
          <span className={`status-value ${isInMaintenance ? 'maintenance-on' : 'maintenance-off'}`}>
            {isInMaintenance ? 'ON' : 'OFF'}
          </span>
        </div>
        {error && (
          <div className="status-item status-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`admin-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          Features ({Object.keys(config.features).length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'hotfixes' ? 'active' : ''}`}
          onClick={() => setActiveTab('hotfixes')}
        >
          Hotfixes ({config.hotfixes.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          System
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="admin-section">
            <h2>Configuration Overview</h2>
            <div className="admin-grid">
              <div className="admin-card">
                <h3>Features</h3>
                <p className="admin-card-value">{Object.keys(config.features).length}</p>
                <div className="admin-card-details">
                  {Object.entries(config.features).slice(0, 5).map(([name, feature]) => (
                    <div key={name} className="feature-item">
                      <span className="feature-name">{name}</span>
                      <span className={`feature-badge ${feature.enabled ? 'enabled' : 'disabled'}`}>
                        {feature.enabled ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  ))}
                  {Object.keys(config.features).length > 5 && (
                    <p className="text-muted">+{Object.keys(config.features).length - 5} more...</p>
                  )}
                </div>
              </div>

              <div className="admin-card">
                <h3>Active Hotfixes</h3>
                <p className="admin-card-value">{config.hotfixes.filter((hf) => hf.enabled).length}</p>
                <div className="admin-card-details">
                  {config.hotfixes
                    .filter((hf) => hf.enabled)
                    .slice(0, 3)
                    .map((hotfix) => (
                      <div key={hotfix.id} className="hotfix-item">
                        <span className={`priority-badge priority-${hotfix.priority.toLowerCase()}`}>
                          {hotfix.priority}
                        </span>
                        <span className="hotfix-desc">{hotfix.description}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="admin-card">
                <h3>System Settings</h3>
                <p className="admin-card-value">{config.systemSettings.logLevel.toUpperCase()}</p>
                <div className="admin-card-details">
                  <div className="setting-item">
                    <span>API Endpoint:</span>
                    <code>{config.systemSettings.apiEndpoint}</code>
                  </div>
                  <div className="setting-item">
                    <span>Max Retries:</span>
                    <code>{config.systemSettings.maxRetries}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="admin-section">
            <h2>Feature Flags</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Feature Name</th>
                    <th>Status</th>
                    <th>Version</th>
                    <th>Rollout %</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(config.features).map(([name, feature]) => (
                    <tr key={name}>
                      <td className="feature-cell-name">{name}</td>
                      <td>
                        <span className={`status-badge ${feature.enabled ? 'enabled' : 'disabled'}`}>
                          {feature.enabled ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                          {feature.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <code>{feature.version}</code>
                      </td>
                      <td>
                        <div className="rollout-bar">
                          <div
                            className="rollout-progress"
                            style={{ width: `${feature.rolloutPercentage}%` }}
                          ></div>
                          <span className="rollout-text">{feature.rolloutPercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'hotfixes' && (
          <div className="admin-section">
            <h2>Active Hotfixes</h2>
            <div className="admin-hotfixes-list">
              {config.hotfixes.length === 0 ? (
                <p className="text-muted">No hotfixes active</p>
              ) : (
                config.hotfixes.map((hotfix) => (
                  <div key={hotfix.id} className="hotfix-card">
                    <div className="hotfix-header">
                      <div className="hotfix-title">
                        <span className={`priority-badge priority-${hotfix.priority.toLowerCase()}`}>
                          {hotfix.priority}
                        </span>
                        <h3>{hotfix.description}</h3>
                      </div>
                      <span className={`hotfix-status ${hotfix.enabled ? 'active' : 'inactive'}`}>
                        {hotfix.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="hotfix-details">
                      <div className="detail-row">
                        <span className="detail-label">ID:</span>
                        <code>{hotfix.id}</code>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Affected Modules:</span>
                        <div className="module-tags">
                          {hotfix.affectedModules.map((module) => (
                            <span key={module} className="module-tag">
                              {module}
                            </span>
                          ))}
                        </div>
                      </div>
                      {hotfix.expiresAt && (
                        <div className="detail-row">
                          <span className="detail-label">Expires:</span>
                          <span>{new Date(hotfix.expiresAt).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Override Config:</span>
                        <pre className="override-config">{JSON.stringify(hotfix.override, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-section">
            <h2>System Settings</h2>
            <div className="admin-settings-form">
              <div className="setting-group">
                <label>Maintenance Mode</label>
                <div className="setting-value">
                  {config.systemSettings.maintenanceMode ? (
                    <span className="badge badge-warning">ENABLED</span>
                  ) : (
                    <span className="badge badge-success">DISABLED</span>
                  )}
                </div>
                {config.systemSettings.maintenanceMessage && (
                  <p className="maintenance-message">{config.systemSettings.maintenanceMessage}</p>
                )}
              </div>

              <div className="setting-group">
                <label>API Configuration</label>
                <div className="setting-row">
                  <span>Endpoint:</span>
                  <code>{config.systemSettings.apiEndpoint}</code>
                </div>
                <div className="setting-row">
                  <span>WebSocket:</span>
                  <code>{config.systemSettings.wsEndpoint}</code>
                </div>
              </div>

              <div className="setting-group">
                <label>Retry Configuration</label>
                <div className="setting-row">
                  <span>Max Retries:</span>
                  <code>{config.systemSettings.maxRetries}</code>
                </div>
                <div className="setting-row">
                  <span>Retry Delay (ms):</span>
                  <code>{config.systemSettings.retryDelay}</code>
                </div>
              </div>

              <div className="setting-group">
                <label>Logging</label>
                <div className="setting-value">
                  <span className="badge badge-info">{config.systemSettings.logLevel.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Info */}
      {showDebug && (
        <div className="admin-debug">
          <h3>Debug Information</h3>
          <pre>{JSON.stringify({ config, lastSyncTime, error }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
