
// Need to include mouse input ****************
var Input = (function() {
    var activeKeyRegistry = {};
    var inactiveKeyRegistry = {};
    var canvasElem;

    window.onkeydown = function(e)
    {
        for (var o in activeKeyRegistry)
            if (e.keyCode in activeKeyRegistry[o] && activeKeyRegistry[o][e.keyCode].readyLoop)
            {
                activeKeyRegistry[o][e.keyCode].controller.pressed = true;
                activeKeyRegistry[o][e.keyCode].readyLoop = false;
            }
    };

    window.onkeyup = function(e)
    {
        for (var o in activeKeyRegistry)
            if (e.keyCode in activeKeyRegistry[o])
            {
                activeKeyRegistry[o][e.keyCode].controller.pressed = false;
                activeKeyRegistry[o][e.keyCode].readyLoop = true;
            }
    };

    var activeMouseRegistry = {};
    var inactiveMouseRegistry = {};

    function onmousemove(e) {
        for (var o in activeMouseRegistry) {
            activeMouseRegistry[o].pos.x = e.pageX - ViewMngr.offsetLeft;
            activeMouseRegistry[o].pos.y = e.pageY - ViewMngr.offsetTop;
        }
    }

    function onmousedown(e) {
        for (var o in activeMouseRegistry) {
            activeMouseRegistry[o].pos.x = e.pageX - ViewMngr.offsetLeft;
            activeMouseRegistry[o].pos.y = e.pageY - ViewMngr.offsetTop;
            switch(e.button) {
                case 0:
                    activeMouseRegistry[o].leftPressed = true;
                    break;
                case 1:
                    activeMouseRegistry[o].middlePressed = true;
                    break;
                case 2:
                    activeMouseRegistry[o].rightPressed = true;
                    break;
            }
        }
    }

    function onmouseup(e) {
        for (var o in activeMouseRegistry) {
            activeMouseRegistry[o].pos.x = e.pageX - ViewMngr.offsetLeft;
            activeMouseRegistry[o].pos.y = e.pageY - ViewMngr.offsetTop;
            switch(e.button) {
                case 0:
                    activeMouseRegistry[o].leftPressed = false;
                    break;
                case 1:
                    activeMouseRegistry[o].middlePressed = false;
                    break;
                case 2:
                    activeMouseRegistry[o].rightPressed = false;
                    break;
            }
        }
    }

    function SwapRegistries(from, to, name) {
        to[name] = from[name];
        delete from[name];
        // reset all key to ready state
        for (var o in to[name]) {
            if(to[name][o].hasOwnProperty('controller')) {
                to[name][o].controller.pressed = false;
                to[name][o].readyLoop = true;
            }
            else {
                to[name][o].leftPressed = false;
                to[name][o].middlePressed = false;
                to[name][o].rightPressed = false;
            }

        }
    }

    return {
        RegisterControlScheme: function(name, active, inputType)
        {
            /// <signature>
            ///  <summary>Store a distinct instance to recieve input</summary>
            ///  <param name="name" type="string">A unique string, the name of the object to be affected by input</param>
            ///  <param name="active" type="bool">Whether or not this object is currently requiring input</param>
            ///  <returns type="void" />
            /// </signature>
            switch(inputType) {
                case InputTypes.keyboard:
                    if(active) activeKeyRegistry[name] = {};
                    else inactiveKeyRegistry[name] = {};
                    break;
                case InputTypes.mouse:
                    if(active) activeMouseRegistry[name] = {};
                    else inactiveMouseRegistry[name] = {};
                    break;
                case InputTypes.gamepad:
                    break;
            }
        },
        UnRegisterControlScheme: function(name)
        {
            /// <signature>
            ///  <summary>Remove a distinct instance from recieving input</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <returns type="void" />
            /// </signature>
            if (name in activeKeyRegistry) delete activeKeyRegistry[name];
            else if (name in inactiveKeyRegistry) delete inactiveKeyRegistry[name];
            else if (name in activeMouseRegistry) delete activeMouseRegistry[name];
            else if (name in inactiveMouseRegistry) delete inactiveMouseRegistry[name];
            else throw ("No object by that name to unregister");
        },
        SetActive: function(name, beActive)
        {
            /// <signature>
            ///  <summary>Set active status of object to recieve input</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <param name="beActive" type="bool">Whether or not this object is to recieve input</param>
            ///  <returns type="void" />
            /// </signature>
            if (!(name in activeKeyRegistry) &&
                !(name in inactiveKeyRegistry) &&
                !(name in activeMouseRegistry) &&
                !(name in inactiveMouseRegistry))
                throw ("No object by that name to change active status");
            else if (name in activeKeyRegistry && beActive == false) {
                SwapRegistries(activeKeyRegistry, inactiveKeyRegistry, name);
            }
            else if (name in inactiveKeyRegistry && beActive) {
                SwapRegistries(inactiveKeyRegistry, activeKeyRegistry, name);
            }
            else if (name in activeMouseRegistry && beActive == false) {
                SwapRegistries(activeMouseRegistry, inactiveMouseRegistry, name);
            }
            else if (name in inactiveMouseRegistry && beActive) {
                SwapRegistries(inactiveMouseRegistry, activeMouseRegistry, name);
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
            for (var o in activeKeyRegistry)
                console.log('Active: ' + o + ' : ' + activeKeyRegistry[o]);
            for (var o in inactiveKeyRegistry)
                console.log('Inactive: ' + o + ' : ' + inactiveKeyRegistry[o]);
            for (var o in activeMouseRegistry)
                console.log('Active: ' + o + ' : ' + activeMouseRegistry[o]);
            for (var o in inactiveMouseRegistry)
                console.log('Inactive: ' + o + ' : ' + inactiveMouseRegistry[o]);
        },
        CheckRegistry: function(name) {
            if(name in activeKeyRegistry || name in inactiveKeyRegistry)
                return InputTypes.keyboard;
            else if (name in activeMouseRegistry || name in inactiveMouseRegistry)
                return InputTypes.mouse;
            else
                return -1;
        },
        CreateInputController: function(name, keyMapping) {
            /// <signature>
            ///  <summary>Add specific input to an object</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <param name="keyMapping" type="int">Use the global object keyMap to get exact key codes for keyboard implementation only</param>
            ///  <returns type="bool" />
            /// </signature>

            if(keyMapping) {
                var keyController = {
                    pressed: false,
                    Release: function() { this.pressed = false; }
                };

                if (name in activeKeyRegistry) {
                    activeKeyRegistry[name][keyMapping] = {
                        controller: keyController,
                        readyLoop: true
                    };
                }
                else if (name in inactiveKeyRegistry) {
                    inactiveKeyRegistry[name][keyMapping] = {
                        controller: keyController,
                        readyLoop: true
                    };
                }
                else
                    throw ("No object by that name to add boolean reference");

                return keyController;
            }

            var mouseController = {
                pos: new Vector2(0, 0),
                leftPressed: false,
                middlePressed: false,
                rightPressed: false,
                LeftRelease: function() { this.leftPressed = false; },
                MiddleRelease: function() { this.middlePressed = false; },
                RightRelease: function() { this.rightPressed = false; },
                SetCursor: function(cursorType) { canvasElem.style.cursor = cursorType; }
            };

            if (name in activeMouseRegistry) {
                activeMouseRegistry[name] = mouseController;
            }
            else if (name in inactiveMouseRegistry) {
                inactiveMouseRegistry[name] = mouseController;
            }
            else
                throw ("No object by that name to add boolean reference");

            return mouseController;
        },
        RemoveInputCall: function(name, input)
        {
            /// <signature>
            ///  <summary>Remove a certain input call from an object</summary>
            ///  <param name="name" type="string">The unique string name given to the object</param>
            ///  <param name="input" type="decimal">Use the global object keyMap to get exact key code to remove</param>
            ///  <returns type="void" />
            /// </signature>
            if (name in activeKeyRegistry)
                delete activeKeyRegistry[name][input];
            else if (name in inactiveKeyRegistry)
                delete inactiveKeyRegistry[name][input];
            else
                throw ("No object by that name to remove callback");
        },
        GetCanvas: function(canvas) {
            canvas.addEventListener('mousemove', onmousemove, false);
            canvas.addEventListener('mousedown', onmousedown, false);
            canvas.addEventListener('mouseup', onmouseup, false);
            canvasElem = canvas;
        }
    };
})();