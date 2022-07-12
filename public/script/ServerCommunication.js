export class ServerCommunication {
    constructor() {
        this.host = document.baseURI;
    }
    
    async makePostRequest(path, body = {}) {
        let url = this.host;
        url += path;
      
        const response = await fetch(url, 
          { method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(body)}
        );
      
        const json = await response.json();
        return json;
      }
}