
function TopDownController(obj, ctrlName) {
    var active = false;

    var ctrl = new ControlScheme();
    var moveSpeed = 10;
    var yawAngle = 0.0;

    // Control object
    var keyName = "Keys: " + ctrlName;
    Input.RegisterControlScheme(keyName, active, InputTypes.keyboard);
    ctrl.moveLeft = Input.CreateInputController(keyName, KeyMap.A);
    ctrl.moveRight = Input.CreateInputController(keyName, KeyMap.D);
    ctrl.moveBack = Input.CreateInputController(keyName, KeyMap.S);
    ctrl.moveForth = Input.CreateInputController(keyName, KeyMap.W);
    ctrl.pitchDown = Input.CreateInputController(keyName, KeyMap.ArrowDown);
    ctrl.pitchUp = Input.CreateInputController(keyName, KeyMap.ArrowUp);
    ctrl.yawLeft = Input.CreateInputController(keyName, KeyMap.ArrowLeft);
    ctrl.yawRight = Input.CreateInputController(keyName, KeyMap.ArrowRight);

    var mouseName = "Mouse: " + ctrlName;
    Input.RegisterControlScheme(mouseName, active, InputTypes.mouse);
    var mouse = Input.CreateInputController("Mouse: " + ctrlName);
    mouse.SetCursor(CursorTypes.crosshair);

    this.SetActive = function(isActive) {
        active = isActive;
        Input.SetActive(keyName, isActive);
        Input.SetActive(mouseName, isActive);
    };

    this.Update = function() {

        if(active) {
            if (ctrl.moveLeft.pressed) {
                obj.trfmLocal.TranslateRight(-moveSpeed * Time.deltaMilli);
            }
            else if (ctrl.moveRight.pressed) {
                obj.trfmLocal.TranslateRight(moveSpeed * Time.deltaMilli);
            }
            if (ctrl.moveForth.pressed) {
                obj.trfmLocal.TranslateFwd(moveSpeed * Time.deltaMilli);
            }
            else if (ctrl.moveBack.pressed) {
                obj.trfmLocal.TranslateFwd(-moveSpeed * Time.deltaMilli);
            }
            if(ctrl.yawLeft.pressed) {
                yawAngle++;
                obj.trfmLocal.SetUpdatedOrient(VEC3_UP, yawAngle);
            }
            else if(ctrl.yawRight.pressed) {
                yawAngle--;
                obj.trfmLocal.SetUpdatedOrient(VEC3_UP, yawAngle);
            }

            /*
             if(this.ctrl.pitchUp.pressed) {
             this.obj.trfmLocal.RotateLocalViewX(this.turnSpeed);
             //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.right, -this.turnSpeed);
             }
             else if(this.ctrl.pitchDown.pressed) {
             this.obj.trfmLocal.RotateLocalViewX(-this.turnSpeed);
             //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.right, this.turnSpeed);
             }
             */
        }
    }
}

// Maybe just a mode of above controller?
function SnipeController(obj, ctrlName) {
    var active = false;

    var ctrl = new ControlScheme();
    var moveSpeed = 10;
    var turnSpeed = 1.0;

    var pitchAngle = 0.0;
    var yawAngle = 0.0;

    // Control object
    var keyName = "Keys: " + ctrlName;
    Input.RegisterControlScheme(keyName, active, InputTypes.keyboard);
    ctrl.moveLeft = Input.CreateInputController(keyName, KeyMap.A);
    ctrl.moveRight = Input.CreateInputController(keyName, KeyMap.D);
    ctrl.moveBack = Input.CreateInputController(keyName, KeyMap.S);
    ctrl.moveForth = Input.CreateInputController(keyName, KeyMap.W);
    ctrl.pitchDown = Input.CreateInputController(keyName, KeyMap.ArrowDown);
    ctrl.pitchUp = Input.CreateInputController(keyName, KeyMap.ArrowUp);
    ctrl.yawLeft = Input.CreateInputController(keyName, KeyMap.ArrowLeft);
    ctrl.yawRight = Input.CreateInputController(keyName, KeyMap.ArrowRight);

    var mouseName = "Mouse: " + ctrlName;
    Input.RegisterControlScheme(mouseName, active, InputTypes.mouse);
    var mouse = Input.CreateInputController("Mouse: " + ctrlName);
    mouse.SetCursor(CursorTypes.crosshair);

    this.SetActive = function(isActive) {
        active = isActive;
        Input.SetActive(keyName, isActive);
        Input.SetActive(mouseName, isActive);
    };

    this.Update = function() {

        if(active) {
            if (this.ctrl.moveLeft.pressed) {
                this.obj.trfmLocal.TranslateRight(-moveSpeed * Time.deltaMilli);
            }
            else if (this.ctrl.moveRight.pressed) {
                this.obj.trfmLocal.TranslateRight(moveSpeed * Time.deltaMilli);
            }
            if (this.ctrl.moveForth.pressed) {
                obj.trfmLocal.TranslateFwd(this.moveSpeed * Time.deltaMilli);
            }
            else if (this.ctrl.moveBack.pressed) {
                this.obj.trfmLocal.TranslateFwd(-this.moveSpeed * Time.deltaMilli);
            }
            /*
             if(this.ctrl.pitchUp.pressed) {
             this.obj.trfmLocal.RotateLocalViewX(this.turnSpeed);
             //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.right, -this.turnSpeed);
             }
             else if(this.ctrl.pitchDown.pressed) {
             this.obj.trfmLocal.RotateLocalViewX(-this.turnSpeed);
             //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.right, this.turnSpeed);
             }
             if(this.ctrl.yawLeft.pressed) {
             this.obj.trfmLocal.RotateLocalView(VEC3_UP, this.turnSpeed);
             //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.up, this.turnSpeed);
             }
             else if(this.ctrl.yawRight.pressed) {
             this.obj.trfmLocal.RotateLocalView(VEC3_UP, -this.turnSpeed);
             //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.up, -this.turnSpeed);
             }
             */
        }
    }
}