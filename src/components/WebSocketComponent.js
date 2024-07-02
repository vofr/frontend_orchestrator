import React, { useEffect , useState, Component} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { BASE_API_URL, WEB_SOCKET } from '../services/api/urls';

class WebSocketComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stompClientInfra: null,
      subscription: null,
    };
  }
  componentDidMount() {
    this.initWebSocketForInfrastructure();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  initWebSocketForInfrastructure = () => {
    if (this.state.stompClientInfra === null) {
      const URL = `${BASE_API_URL}${WEB_SOCKET}`;
      const websocket = new SockJS(URL);
      const stompClient = Stomp.over(websocket);
      stompClient.connect({}, () => {
        const newSubscription = stompClient.subscribe(`/infrastructure`, (message) => {
          this.props.handleNotification(JSON.parse(message.body));
        });

        this.setState({
          stompClientInfra: stompClient,
          subscription: newSubscription,
        });
      });
    }
  };

  unsubscribe = () => {
    const { stompClientInfra, subscription } = this.state;
    if (subscription) {
      subscription.unsubscribe();
    }
    if (stompClientInfra) {
      stompClientInfra.disconnect(() => {
        console.log('WebSocket disconnected.');
      });
      this.setState({
        stompClientInfra: null,
        subscription: null,
      });
    }
  };

  render() {
    return (
      <div>
        <h1>WebSocket Subscription</h1>
        <p>Check console for WebSocket messages</p>
      </div>
    );
  }
}

  export default WebSocketComponent;