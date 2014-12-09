
// Need to include mouse input ****************
var Input = (function() {
    var activeRegistry = {};
    var inactiveRegistry = {};

    window.onkeydown = function(e)
    {
        for (var o in activeRegistry)
            if (e.keyCode in activeRegistry[o] && activeRegistry[o][e.keyCode].readyLoop)
            {
                activeRegistry[o][e.keyCode].boolToChange.pressed = true;
                activeRegistry[o][e.keyCode].readyLoop = false;
            }
    };

    window.onkeyup = function(e)
    {
        for (var o in activeRegistry)
            if (e.keyCode in activeRegistry[o])
            {
                activeRegistry[o][e.keyCode].boolToChange.pressed = false;
                activeRegistry[o][e.keyCode].readyLoop = true;
            }
    };

    return {
        RegisterObject: function(objectName, active)
        {
            /// <signature>
            ///  <summary>Store a distinct instance to recieve input</summary>
            ///  <param name="objectName" type="string">A unique string, the name of the object to be affected by input</param>
            ///  <param name="active" type="bool">Whether or not this object is currently requiring input</param>
            ///  <returns type="void" />
            /// </signature>
            if(active)
                activeRegistry[objectName] = {};
            else
                inactiveRegistry[objectName] = {};
        },
        UnRegisterObject: function(objectName)
        {
            /// <signature>
            ///  <summary>Remove a distinct instance from recieving input</summary>
            ///  <param name="objectName" type="string">The unique string name given to the object</param>
            ///  <returns type="void" />
            /// </signature>
            if (objectName in activeRegistry)
                delete activeRegistry[objectName];
            else if (objectName in inactiveRegistry)
                delete inactiveRegistry[objectName];
            else
                throw ("No object by that name to unregister");
        },
        SetActive: function(objectName, beActive)
        {
            /// <signature>
            ///  <summary>Set active status of object to recieve input</summary>
            ///  <param name="objectName" type="string">The unique string name given to the object</param>
            ///  <param name="beActive" type="bool">Whether or not this object is to recieve input</param>
            ///  <returns type="void" />
            /// </signature>
            if (!(objectName in activeRegistry) && !(objectName in inactiveRegistry))
                throw ("No object by that name to change active status");

            if (objectName in activeRegistry && beActive == false) {
                inactiveRegistry[objectName] = activeRegistry[objectName];
                delete activeRegistry[objectName];
            }
            else if (objectName in inactiveRegistry && beActive) {
                activeRegistry[objectName] = inactiveRegistry[objectName];
                delete inactiveRegistry[objectName];
            }
            else
                console.log("Object is already where you want it");
        },
        ListInputObjects: function()
        {
            /// <signature>
            ///  <summary>List all objects registered to recieve input at some point</summary>
            ///  <returns type="void" />
            /// </signature>
            for (var o in activeRegistry)
                console.log('Active: ' + o + ' : ' + activeRegistry[o]);
            for (var o in inactiveRegistry)
                console.log('Inactive: ' + o + ' : ' + inactiveRegistry[o]);
        },
        CreateInputController: function(objectName, inputCode) {
            /// <signature>
            ///  <summary>Add specific input to an object</summary>
            ///  <param name="objectName" type="string">The unique string name given to the object</param>
            ///  <param name="input" type="decimal">Use the global object keyMap to get exact key codes</param>
            ///  <returns type="bool" />
            /// </signature>
            var keyController = {
                pressed: false,
                Release: function() { this.pressed = false; }
            }

            if (objectName in activeRegistry) {
                activeRegistry[objectName][inputCode] = {
                    boolToChange: keyController,
                    readyLoop: true
                };
            }
            else if (objectName in inactiveRegistry) {
                inactiveRegistry[objectName][inputCode] = {
                    boolToChange: keyController,
                    readyLoop: true
                };
            }
            else
                throw ("No object by that name to add boolean reference");

            return keyController;
        },
        RemoveInputCall: function(objectName, input)
        {
            /// <signature>
            ///  <summary>Remove a certain input call from an object</summary>
            ///  <param name="objectName" type="string">The unique string name given to the object</param>
            ///  <param name="input" type="decimal">Use the global object keyMap to get exact key code to remove</param>
            ///  <returns type="void" />
            /// </signature>
            if (objectName in activeRegistry)
                delete activeRegistry[objectName][input];
            else if (objectName in inactiveRegistry)
                delete inactiveRegistry[objectName][input];
            else
                throw ("No object by that name to remove callback");
        }
    };
})();