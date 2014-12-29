
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
        RegisterControlScheme: function(name, active)
        {
            /// <signature>
            ///  <summary>Store a distinct instance to recieve input</summary>
            ///  <param name="name" type="string">A unique string, the name of the object to be affected by input</param>
            ///  <param name="active" type="bool">Whether or not this object is currently requiring input</param>
            ///  <returns type="void" />
            /// </signature>
            if(active)
                activeRegistry[name] = {};
            else
                inactiveRegistry[name] = {};
        },
        UnRegisterControlScheme: function(name)
        {
            /// <signature>
            ///  <summary>Remove a distinct instance from recieving input</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <returns type="void" />
            /// </signature>
            if (name in activeRegistry)
                delete activeRegistry[name];
            else if (name in inactiveRegistry)
                delete inactiveRegistry[name];
            else
                throw ("No object by that name to unregister");
        },
        SetActive: function(name, beActive)
        {
            /// <signature>
            ///  <summary>Set active status of object to recieve input</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <param name="beActive" type="bool">Whether or not this object is to recieve input</param>
            ///  <returns type="void" />
            /// </signature>
            if (!(name in activeRegistry) && !(name in inactiveRegistry))
                throw ("No object by that name to change active status");
            else if (name in activeRegistry && beActive == false) {
                inactiveRegistry[name] = activeRegistry[name];
                delete activeRegistry[name];
            }
            else if (name in inactiveRegistry && beActive) {
                activeRegistry[name] = inactiveRegistry[name];
                delete inactiveRegistry[name];
            }
            else
                throw ("Object is already where you want it");
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
        CreateInputController: function(name, inputCode) {
            /// <signature>
            ///  <summary>Add specific input to an object</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <param name="input" type="decimal">Use the global object keyMap to get exact key codes</param>
            ///  <returns type="bool" />
            /// </signature>
            var keyController = {
                pressed: false,
                Release: function() { this.pressed = false; }
            }

            if (name in activeRegistry) {
                activeRegistry[name][inputCode] = {
                    boolToChange: keyController,
                    readyLoop: true
                };
            }
            else if (name in inactiveRegistry) {
                inactiveRegistry[name][inputCode] = {
                    boolToChange: keyController,
                    readyLoop: true
                };
            }
            else
                throw ("No object by that name to add boolean reference");

            return keyController;
        },
        RemoveInputCall: function(name, input)
        {
            /// <signature>
            ///  <summary>Remove a certain input call from an object</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <param name="input" type="decimal">Use the global object keyMap to get exact key code to remove</param>
            ///  <returns type="void" />
            /// </signature>
            if (name in activeRegistry)
                delete activeRegistry[name][input];
            else if (name in inactiveRegistry)
                delete inactiveRegistry[name][input];
            else
                throw ("No object by that name to remove callback");
        }
    };
})();