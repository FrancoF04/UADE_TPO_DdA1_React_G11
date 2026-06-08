import { WS_BASE_URL } from '../config/constants';

class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Set();
        this.statusListeners = new Set();
        this.reconnectTimeout = null;
        this.shouldReconnect = false;
        this.reconnectInterval = 3000; // Intentar reconectar cada 3 segundos
        this.connectionStatus = 'Disconnected'; // 'Disconnected' | 'Connecting' | 'Connected' | 'Error'
    }

    /**
     * Inicia la conexión con el WebSocket del robot.
     * @param {string} [customUrl] URL opcional si se quiere sobrescribir la configurada por defecto.
     */
    connect(customUrl = WS_BASE_URL) {
        if (this.ws) {
            console.log('[WebSocket] Ya existe una conexión activa o en proceso.');
            return;
        }

        this.shouldReconnect = true;
        this._updateStatus('Connecting');
        console.log(`[WebSocket] Conectando a ${customUrl}...`);

        try {
            this.ws = new WebSocket(customUrl);

            this.ws.onopen = () => {
                console.log('[WebSocket] Conexión establecida.');
                this._updateStatus('Connected');
                if (this.reconnectTimeout) {
                    clearTimeout(this.reconnectTimeout);
                    this.reconnectTimeout = null;
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this._notifyListeners(data);
                } catch (err) {
                    console.error('[WebSocket] Error al deserializar mensaje JSON:', err);
                }
            };

            this.ws.onerror = (error) => {
                console.error('[WebSocket] Error producido:', error.message || error);
                this._updateStatus('Error');
            };

            this.ws.onclose = (event) => {
                console.log(`[WebSocket] Conexión cerrada. Código: ${event.code}, Razón: ${event.reason}`);
                this.ws = null;
                this._updateStatus('Disconnected');

                if (this.shouldReconnect) {
                    console.log(`[WebSocket] Reconectando en ${this.reconnectInterval / 1000}s...`);
                    this.reconnectTimeout = setTimeout(() => {
                        this.connect(customUrl);
                    }, this.reconnectInterval);
                }
            };
        } catch (error) {
            console.error('[WebSocket] Excepción al intentar conectar:', error);
            this._updateStatus('Error');
            this._handleReconnect(customUrl);
        }
    }

    /**
     * Cierra la conexión activa del WebSocket de forma intencional y detiene las reconexiones automáticas.
     */
    disconnect() {
        console.log('[WebSocket] Desconectando intencionalmente...');
        this.shouldReconnect = false;
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this._updateStatus('Disconnected');
    }

    /**
     * Permite suscribirse a los datos de telemetría recibidos por el WebSocket.
     * Devuelve una función para para desuscribirse de manera sencilla.
     * @param {Function} callback Función receptora de los datos parseados de telemetría.
     * @returns {Function} Función para cancelar la suscripción.
     */
    subscribe(callback) {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Permite suscribirse a los cambios de estado de la propia conexión de WebSocket.
     * @param {Function} callback Función receptora del estado ('Disconnected' | 'Connecting' | 'Connected' | 'Error').
     * @returns {Function} Función para cancelar la suscripción.
     */
    subscribeStatus(callback) {
        this.statusListeners.add(callback);
        // Notificar el estado actual inmediatamente al suscribirse
        callback(this.connectionStatus);
        return () => {
            this.statusListeners.delete(callback);
        };
    }

    /**
     * Obtiene el estado actual de la conexión de WebSocket.
     * @returns {string} Estado actual.
     */
    getStatus() {
        return this.connectionStatus;
    }

    /**
     * Envía un mensaje a través del WebSocket (si el protocolo lo requiere para handshake o comandos especiales).
     * @param {Object|string} message Objeto o string a enviar.
     */
    send(message) {
        if (this.ws && this.connectionStatus === 'Connected') {
            const payload = typeof message === 'string' ? message : JSON.stringify(message);
            this.ws.send(payload);
        } else {
            console.warn('[WebSocket] No se puede enviar el mensaje. WebSocket no está conectado.');
        }
    }

    _handleReconnect(url) {
        if (this.shouldReconnect && !this.reconnectTimeout) {
            this.reconnectTimeout = setTimeout(() => {
                this.reconnectTimeout = null;
                this.connect(url);
            }, this.reconnectInterval);
        }
    }

    _updateStatus(newStatus) {
        if (this.connectionStatus !== newStatus) {
            this.connectionStatus = newStatus;
            this.statusListeners.forEach((listener) => {
                try {
                    listener(newStatus);
                } catch (err) {
                    console.error('[WebSocket] Error en status listener:', err);
                }
            });
        }
    }

    _notifyListeners(data) {
        this.listeners.forEach((listener) => {
            try {
                listener(data);
            } catch (err) {
                console.error('[WebSocket] Error en data listener:', err);
            }
        });
    }
}

export const webSocketService = new WebSocketService();
