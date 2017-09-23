import React from 'react';
import Config from './config';
import { Container, Row, Col, Button, Badge } from 'reactstrap';

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Container>
          <Row style={{flexDirection: 'row', paddingTop: 25}}>
            <h1>Project Rome demo</h1>
          </Row>
          <Row>
            <Col>
              <Control config={Config} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

class Control extends React.Component {
  constructor(){
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      token: null,
      loggedIn: false
    }
  }

  logout(config){
      const applicationConfig = config;
      const clientApplication = new Msal.UserAgentApplication(applicationConfig.clientID, applicationConfig.authority, function (errorDesc, token, error, tokenType) {
            // Called after loginRedirect or acquireTokenPopup
        });
      clientApplication.logout();
  }

  login(config){
    return new Promise(function(resolve, reject){
        const applicationConfig = config;
        const clientApplication = new Msal.UserAgentApplication(applicationConfig.clientID, applicationConfig.authority, function (errorDesc, token, error, tokenType) {
            // Called after loginRedirect or acquireTokenPopup
        });
        clientApplication.loginPopup(applicationConfig.scopes).then(function (idToken) {
        clientApplication.acquireTokenSilent(applicationConfig.scopes).then(function (accessToken) {
          resolve(accessToken);
        }, function (error) {
            clientApplication.acquireTokenPopup(applicationConfig.scopes).then(function (accessToken) {
                resolve(accessToken);
            }, function (error) {
                reject(error);
            });
        })
      }, function (error) {
          reject(error);
      });
    });
  }
  
  render(){
    return (
      <div>
        <div style={{flexDirection: 'row'}}>
          {(this.state.token) ? (<DeviceCollection token={this.state.token} />) : null }
        </div>
        <Button color="primary"
          onClick={() => {
            //make request
            if (this.state.loggedIn){
              this.logout(this.props.config).then(()=>{
              this.setState({token: null, loggedIn: false})
              });
            } else {
              this.login(this.props.config).then((token)=>{
              this.setState({token: token, loggedIn: true})
              });
            }
          }}>
          <span>{(this.state.loggedIn) ? 'Log out' : 'Log in'}</span> 
          </Button >
        </div>
    );
  }
}

class DeviceCollection extends React.Component {  
  constructor(){
    super();
    this.fetchDevices = this.fetchDevices.bind(this);
     this.state = {
      devices: null
    }
  }

  componentWillMount(){
    if (this.props.token){
      this.fetchDevices(this.props.token);
    }
  }

  fetchDevices(token){
    const headers = new Headers({'Authorization': 'Bearer '+token})
    const config = { method: 'GET',
               headers: headers };
    fetch('https://graph.microsoft.com/beta/me/devices', config).then((resp)=>{
      return resp.json();
    }).then((data)=>{
      console.log(data);
      this.setState(
        {devices: data}
      )
    });
  }

  render(){
    return (
    <div>
      { (this.state.devices) ?  (this.state.devices.value.map((device, idx)=>(<DeviceListing device={device} token={this.props.token} key={idx} />))) : null }
    </div>
    );
  }

}

class DeviceListing extends React.Component {
  constructor(){
    super();
    this.launchBrowser = this.launchBrowser.bind(this);
  }

  launchBrowser(token, id){
    const headers = new Headers(
      {'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json; charset=utf-8'})
    const body = JSON.stringify({ "type" : "LaunchUri", "payload" : {"uri":"http://bing.com"}});
    const config = { method: 'POST',
               headers: headers,
               body: body };
    fetch('https://graph.microsoft.com/beta/me/devices/'+id+'/commands', config).then((resp)=>{
      return resp.json();
    }).then((data)=>{
      console.log(data);
      this.setState(
        {devices: data}
      )
    });
  }

  render(){
    return (
      <div style={{flexDirection: 'row', paddingBottom: 25}}>
        <h2>Device name: {this.props.device.Name}</h2>
        <div>
          {this.props.device.Status == 'Online' ?
            (<div><h3><Badge color="success"> {this.props.device.Status} </Badge></h3>
             <Button onClick={() => (this.launchBrowser(this.props.token, this.props.device.id))}>Open webpage</Button></div>) :
            (<div><h3><Badge color="warning"> {this.props.device.Status}</Badge></h3></div>)
          }
        </div>
      </div>
    );
  }
}

export default App;