/*
 * @Date: 2024-08-13 17:25:54
 * @LastEditTime: 2024-08-13 17:25:55
 * @Description: 
 * @FilePath: /my-browser-plugins/js/http.js
 */


class HttpRequestInterceptor {
  constructor() {
    this.requests = [];
    // fetch
    this.initFetchInterceptor();
    // http
    this.initXhrInterceptor();
  }

  initFetchInterceptor () {
    console.log('fetch---')
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch.apply(this, args);
      const clonedResponse = response.clone();
      const responseBody = await clonedResponse.text();
      const requestInfo = {
        method: args[1]?.method || 'GET',
        url: args[0],
        headers: args[1]?.headers || {},
        body: args[1]?.body || null,
        response: responseBody,
        status: response.status,
        statusText: response.statusText
      };
      this.requests.push(requestInfo);
      return response;
    };
  }

  initXhrInterceptor () {
    console.log('xhr---')
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    console.log('🚀🚀 ~ HttpRequestInterceptor ~ initXhrInterceptor ~ originalXhrOpen:', originalXhrOpen)
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      this._method = method;
      this._url = url;
      this._headers = {};
      return originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      this._headers[header] = value;
      return XMLHttpRequest.prototype.setRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      this._body = body;

      const onLoad = () => {
        const responseHeaders = this.getAllResponseHeaders();
        const response = this.responseText;
        const status = this.status;
        const statusText = this.statusText;
        const requestInfo = {
          method: this._method,
          url: this._url,
          headers: this._headers,
          body: this._body,
          response: response,
          status: status,
          statusText: statusText
        };
        this._interceptor.requests.push(requestInfo);
      };

      this.addEventListener('load', onLoad);
      this.addEventListener('error', onLoad);
      this.addEventListener('abort', onLoad);

      return originalXhrSend.apply(this, arguments);
    };

    const xhrProxyHandler = {
      construct (target, args) {
        const xhrInstance = new target(...args);
        xhrInstance._interceptor = this;
        return xhrInstance;
      }
    };

    window.XMLHttpRequest = new Proxy(XMLHttpRequest, xhrProxyHandler);
  }

  getAllRequests () {
    return this.requests;
  }
}