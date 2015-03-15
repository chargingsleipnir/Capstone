
function TopDownController(obj, ctrlName) {
    var active = false;

    var ctrl = new ControlScheme();
    var moveSpeed = 1250;
    var yawAngle = 0.0;

    // Control object
    var keyName = "Keys: " + ctrlName;
    Input.RegisterControlScheme(keyName, active, InputTypes.keyboard);
    ctrl.moveLeft = Input.CreateInputController(keyName, KeyMap.A);
    ctrl.moveRight = Input.CreateInputController(keyName, KeyMap.D);
    ctrl.moveBack = Input.CreateInputController(keyName, KeyMap.S);
    ctrl.moveForth = Input.CreateInputController(keyName, KeyMap.W);
    ctrl.yawLeft = Input.CreateInputController(keyName, KeyMap.ArrowLeft);
    ctrl.yawRight = Input.CreateInputController(keyName, KeyMap.ArrowRight);

    var dir;

    this.SetActive = function(isActive) {
        active = isActive;
        Input.SetActive(keyName, isActive);
    };

    this.Update = function() {

        if(active) {
            if (ctrl.moveLeft.pressed) {
                dir = obj.trfmGlobal.GetRight();
                obj.rigidBody.AddForce(dir.SetScaleByNum(-moveSpeed));
            }
            else if (ctrl.moveRight.pressed) {
                dir = obj.trfmGlobal.GetRight();
                obj.rigidBody.AddForce(dir.SetScaleByNum(moveSpeed));
            }
            if (ctrl.moveForth.pressed) {
                dir = obj.trfmGlobal.GetFwd();
                obj.rigidBody.AddForce(dir.SetScaleByNum(moveSpeed));
            }
            else if (ctrl.moveBack.pressed) {
                dir = obj.trfmGlobal.GetFwd();
                obj.rigidBody.AddForce(dir.SetScaleByNum(-moveSpeed));
            }
            if(ctrl.yawLeft.pressed) {
                yawAngle++;
                obj.trfmBase.SetUpdatedRot(VEC3_UP, yawAngle);
            }
            else if(ctrl.yawRight.pressed) {
                yawAngle--;
                obj.trfmBase.SetUpdatedRot(VEC3_UP, yawAngle);
            }
        }
    }
}