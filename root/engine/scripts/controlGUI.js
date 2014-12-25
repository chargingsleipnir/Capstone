
// Single set of windows & data
function GUISystem(rect) {
    if (rect) {
        this.sysRect = rect.GetCopy();
        if (this.sysRect.w <= 0.0) this.sysRect.w = GM.wndWidth - this.sysRect.x;
        if (this.sysRect.h <= 0.0) this.sysRect.h = GM.wndHeight - this.sysRect.y;

        if (this.sysRect.x < 0.0) this.sysRect.x = 0.0;
        if (this.sysRect.y < 0.0) this.sysRect.y = 0.0;
    }
    else {
        this.sysRect = new Rect(0.0, 0.0, GM.wndWidth, GM.wndHeight);
    }

    this.msgBoxes = {
        dispBoxes: []
    };

    this.active = false;
}
GUISystem.prototype = {
    AddMsgBox: function(msg, rect, depth, bgColour, fontColour, texture) {
        var boxModel = new Primitives.Rect(new Vector2(rect.w/2.0, rect.h/2.0), bgColour);

    }
};

var GUINetwork = (function() {

    var guiSystems = [];

    return {
        AddSystem: function(system, setActive) {
            system.active = setActive;
            guiSystems.push(system);
        },
        GetSystems: function() {
            return guiSystems;
        },
        Update: function() {
            for(var i = 0; i < guiSystems.length; i++)
                if(guiSystems[i].active)
                    guiSystems[i].Update();
        }
    }
})();