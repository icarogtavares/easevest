var PayloadPanel = (function() {
  var settings = {
    payloadTypes: {
      request: 'request',
      response: 'response'
    }
  }

  return {
    init: init,
  };

  function init() {
    payloadUpdateSetup()
  }

  function payloadUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload
    Api.setRequestPayload = function(newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr)
    }

    var currentResponsePayloadSetter = Api.setResponsePayload
    Api.setResponsePayload = function(newPayload) {
      currentResponsePayloadSetter.call(Api, newPayload)
    }
  }


}())
