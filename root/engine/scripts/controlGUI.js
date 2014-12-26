
function GUISystem(rect) {
    /// <signature>
    ///  <summary>Create a system of contained Gui elements</summary>
    ///  <param name="rect" type="Rect">The size of the container. No elements added to the system will be outside this area</param>
    /// </signature>
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
        boxMdls: [],
        textBlocks: []
    };

    this.active = false;
}
GUISystem.prototype = {
    AddMsgBox: function(msg, rect, depth, style) {
        /// <signature>
        ///  <summary>Add a msg box to this system</summary>
        ///  <param name="msg" type="string"></param>
        ///  <param name="rect" type="Rect"></param>
        ///  <param name="depth" type="int">Defines overlap position relative to other elements within this system</param>
        ///  <param name="style" type="MsgBoxStyle Object">A struct of various styke details that can be applied to this message box</param>
        /// </signature>

        /* Might be able to create a range of depth within the NDC, and in front
          * of everything else being affected by transformations. Maybe convert the
           * "depth" to a range of 0.00 to -0.10 */

        /********* BOX ***********/

        // Convert sizes to account for NDC of viewport, -1 to 1
        var w = rect.w * (2.0/GM.wndWidth),
            h = rect.h * (2.0/GM.wndHeight);

        var boxModel = new Primitives.Rect(new Vector2(w/2.0, h/2.0));
        var boxHdl = new GUIBoxHandler(boxModel.vertices.byMesh);
        if(style.bgColour)
            boxHdl.colourTint.SetCopy(style.bgColour);
        if(style.bgTexture)
            boxHdl.SetTexture(style.bgTexture, TextureFilters.linear);
        this.msgBoxes.boxMdls.push(boxHdl);

        /********* TEXT ***********/

        // Convert sizes to account for NDC of viewport, -1 to 1
        var fsW = style.fontSize ? style.fontSize * (2.0/GM.wndWidth) : 0.01 * (GM.wndWidth / GM.wndHeight),
            fsH = style.fontSize ? style.fontSize * (2.0/GM.wndHeight) : 0.01;

        var stringObjHndl = new StringDisplayHandler(new Primitives.StringLine(msg, new Vector2(fsW/2.0, fsH/2.0)));
        if(style.fontColour)
            stringObjHndl.colourTint.SetCopy(style.fontColour);
        this.msgBoxes.textBlocks.push(stringObjHndl);
    },
    Update: function() {

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