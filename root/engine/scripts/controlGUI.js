/**
 * Created by Devin on 2014-12-26.
 */

/********** Objects to be parented and added to a system ************/

function GUIObject(wndRect, msg, style) {
    /// <signature>
    ///  <summary>Add a msg box to this system</summary>
    ///  <param name="wndRect" type="Rect">Pos x and y use viewport space, with (0,0) in the top-left</param>
    ///  <param name="msg" type="string"></param>
    ///  <param name="depth" type="int">Defines overlap position relative to other elements within this system</param>
    ///  <param name="style" type="MsgBoxStyle Object">A struct of various styke details that can be applied to this message box</param>
    /// </signature>
    this.wndRect = wndRect;
    this.children = [];

    /* Might be able to create a range of depth within the NDC, and in front
     * of everything else being affected by transformations. Maybe convert the
     * "depth" to a range of 0.00 to -0.10 */

    /********* BOX ***********/

    // Convert sizes to account for NDC of viewport, -1 to 1
    var w = WndUtils.WndX_To_GLNDCX(wndRect.w),
        h = WndUtils.WndY_To_GLNDCY(wndRect.h),
        x = WndUtils.WndX_To_GLNDCX(wndRect.x) + this.sysRect.pos.x,
        y = (WndUtils.WndY_To_GLNDCY(wndRect.y) + this.sysRect.pos.y) * -1;

    var boxModel = new Primitives.Rect(new Vector2(w, h));
    var posCoords = boxModel.vertices.byMesh.posCoords;
    // Set box' pos to that defined in the rect

    for(var i = 0; i < posCoords.length; i+= 3) {
        posCoords[i] += x;
        posCoords[i+1] += y;
    }

    this.boxHdl = new GUIBoxHandler(boxModel.vertices.byMesh);
    if(style.bgColour)
        this.boxHdl.colourTint.SetCopy(style.bgColour);
    if(style.bgTexture)
        this.boxHdl.SetTexture(style.bgTexture, TextureFilters.linear);


    /********* TEXT ***********/

    var fsW = style.fontSize ? WndUtils.WndX_To_GLNDCX(style.fontSize) : 0.01 * (GM.wndWidth / GM.wndHeight),
        fsH = style.fontSize ? WndUtils.WndY_To_GLNDCY(style.fontSize) : 0.01;

    this.strObjHndl = new StringDisplayHandler(new StringLine(msg, new Vector2(fsW/2.0, fsH/2.0)));
    if(style.fontColour)
        this.strObjHndl.colourTint.SetCopy(style.fontColour);
}
GUIObject.prototype = {
    AddChild: function(guiObject) {
        /// <signature>
        ///  <summary>Add a gameObject as a child of the caller</summary>
        ///  <param name="guiObject" type="GUIObject"></param>
        ///  <returns type="void" />
        /// </signature>
        guiObject.parent = this;
        this.children.push(guiObject);
    },
    AsMsgBox: function(msg, style) {

    },
    Update: function() {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].Update(this.wndRect);
        }
    }
};

/********** Systems to be added to the Network ************/

function GUISystem(wndRect, name) {
    /// <signature>
    ///  <summary>Create a system of contained Gui elements</summary>
    ///  <param name="name" type="string">System identifier</param>
    ///  <param name="wndRect" type="Rect">The size of the container. No elements added to the system will be outside this area</param>
    /// </signature>

    this.sysRect = new WndRect();
    this.name = name;
    this.rootObjs = [];
    this.boxMdls = [];
    this.textBlocks = [];

    if (wndRect) {
        this.sysRect.SetValues(
            WndUtils.WndX_To_GLNDCX(wndRect.x) - 1,
            WndUtils.WndY_To_GLNDCY(wndRect.y) - 1,
            WndUtils.WndX_To_GLNDCX(wndRect.w),
            WndUtils.WndY_To_GLNDCY(wndRect.h)
        );
    }
}
GUISystem.prototype = {
    AddGUIObject: function(guiObj) {
        guiObj.system = this;
        // Traverse tree and get all models
        function TraverseTree(parent) {
            this.boxMdls.push(parent.boxHdl);
            this.textBlocks.push(parent.strObjHdl);
            for (var i = 0; i < parent.children.length; i++)
                TraverseTree(parent.children[i]);
        }
        TraverseTree(guiObj);

        this.rootObjs.push(guiObj);

        // SEND RECT INFO
    },
    Update: function() {
        for(var i = 0; i < this.rootObjs.length; i++)
            this.rootObjs[i].Update();
    }
};

/********** Network that controls which systems to update and draw ************/

var GUINetwork = (function() {

    var activeSystems = {};
    var inactiveSystems = {};

    this.msgBoxes = {
        boxMdls: [],
        textBlocks: []
    };

    return {
        AddSystem: function(system, setActive) {
            if(setActive)
                activeSystems[system.name] = system;
            else
                inactiveSystems[system.name] = system;
        },
        RemoveSystem: function(sysName) {
            if (sysName in activeSystems)
                delete activeSystems[sysName];
            else if (sysName in inactiveSystems)
                delete inactiveSystems[sysName];
            else
                throw ("No system by that name to unregister");
        },
        SetActive: function(sysName, setActive) {
            if (!(sysName in activeSystems) && !(sysName in inactiveSystems))
                throw ("No system by that name to change active status");
            else if (sysName in activeSystems && setActive == false) {
                inactiveSystems[sysName] = activeSystems[sysName];
                delete activeSystems[sysName];
            }
            else if (sysName in inactiveSystems && setActive) {
                activeSystems[sysName] = inactiveSystems[sysName];
                delete inactiveSystems[sysName];
            }
            else
                throw ("Object is already where you want it");
        },
        GetSystems: function() {
            return activeSystems;
        },
        ListGUISystems: function() {
            for (var o in activeSystems)
                console.log('Active: ' + o + ' : ' + activeSystems[o]);
            for (var o in inactiveSystems)
                console.log('Inactive: ' + o + ' : ' + inactiveSystems[o]);
        },
        Update: function() {
            for(var sys in activeSystems)
                activeSystems[sys].Update();
        }
    }
})();



/********** Build text for rendering **********/

function StringLine(string, charRadii) {
    var w, h;
    if(charRadii) {
        w = charRadii.x;
        h = charRadii.y;
    }
    else {
        w = h = 1.0;
    }

    function ShiftedPosCoords(shift) {
        return [
            -w + shift, h, 0.0,
            -w + shift, -h, 0.0,
            w + shift, -h, 0.0,
            -w + shift, h, 0.0,
            w + shift, -h, 0.0,
            w + shift, h, 0.0
        ];
    }

    var posCoords = [];
    var texCoords = [];

    for (var i = 0; i < string.length; i++) {
        posCoords = posCoords.concat(ShiftedPosCoords(i*w*2));
        texCoords = texCoords.concat(SpecialUtils.GetTexCoords(string[i]));
    }

    return {
        count: string.length * 6,
        posCoords: posCoords,
        colElems: [],
        texCoords: texCoords,
        normAxes: []
    };
}