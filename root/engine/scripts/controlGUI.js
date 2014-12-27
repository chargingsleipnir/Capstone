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
    this.rectLocal = wndRect.GetCopy();
    this.rectGlobal = new WndRect();
    this.msg = msg;
    this.style = new MsgBoxStyle(style);
    this.children = [];

    /* Might be able to create a range of depth within the NDC, and in front
     * of everything else being affected by transformations. Maybe convert the
     * "depth" to a range of 0.00 to -0.10 */
}
GUIObject.prototype = {
    AddChild: function(guiObject) {
        /// <signature>
        ///  <summary>Add a gameObject as a child of the caller</summary>
        ///  <param name="guiObject" type="GUIObject"></param>
        ///  <returns type="void" />
        /// </signature>
        this.children.push(guiObject);
    },
    UpdateGlobalRect: function(parentRect) {
        // Dimensions are checked to make sure parenting is upheld
        if(this.rectLocal.w > parentRect.w) {
            this.rectLocal.w = parentRect.w;
        }
        if(this.rectLocal.h > parentRect.h) {
            this.rectLocal.h = parentRect.h;
        }

        this.rectGlobal.SetValues(
            this.rectLocal.x + parentRect.x,
            this.rectLocal.y + parentRect.y,
            this.rectLocal.w,
            this.rectLocal.h
        );

        var contDiff = parentRect.ContainsWndRect(this.rectGlobal);
        if(!contDiff.GetMagSqr() == 0) {

            this.rectGlobal.x -= contDiff.x;
            this.rectGlobal.y -= contDiff.y;
        }
    },
    InstantiateDisplay: function() {

        /****************** BOX ********************/

        // Convert sizes to account for NDC of viewport, -1 to 1
        var radialW = WndUtils.WndX_To_GLNDCX(this.rectLocal.w) / 2,
            radialH = WndUtils.WndY_To_GLNDCY(this.rectLocal.h) / 2,
            x = WndUtils.WndX_To_GLNDCX(this.rectGlobal.x) - 1,
            y = (WndUtils.WndY_To_GLNDCY(this.rectGlobal.y) - 1) * -1;

        // Divide
        var boxModel = new Primitives.Rect(new Vector2(radialW, radialH));
        var posCoords = boxModel.vertices.byMesh.posCoords;
        // Set box' pos to that defined in the rect

        for(var i = 0; i < posCoords.length; i+= 3) {
            // Add width and subtract height because the model is built from the centre out,
            // while the rects measure from the top-left to the bottom-right.
            posCoords[i] += (x + radialW);
            posCoords[i+1] += (y - radialH);
        }

        this.boxHdl = new GUIBoxHandler(boxModel.vertices.byMesh);
        this.boxHdl.colourTint.SetCopy(this.style.bgColour);
        if(this.style.bgTexture)
            this.boxHdl.SetTexture(this.style.bgTexture, TextureFilters.linear);



        /****************** TEXT ********************/

        //style.fontSize = 30;
        //style.textMaxWidth = 60;
        //style.textAlignWidth = Alignment.centre;
        //style.textAlignHeight = Alignment.bottom;
        // margin = 1.0

        /*
        console.log(this.msg.length);
        console.log(this.style.fontSize * this.msg.length);
        console.log(this.style.fontSize * this.style.textMaxWidth);
        console.log(this.rectLocal.w);
        */

        var maxHeightPX = this.rectLocal.h - this.style.margin * 2;
        var maxWidthPX = this.style.fontSize * this.style.textMaxWidth - this.style.margin * 2;
        if(this.rectLocal.w < maxWidthPX) maxWidthPX = this.rectLocal.w - this.style.margin * 2;

        var msgBlock = [];
        TextUtils.CreateBoundTextBlock(this.msg, this.style.fontSize, this.style.textLineSpacing, maxWidthPX, maxHeightPX, msgBlock);

        var fsW = this.style.fontSize ? WndUtils.WndX_To_GLNDCX(this.style.fontSize) : 0.01 * (GM.wndWidth / GM.wndHeight),
            fsH = this.style.fontSize ? WndUtils.WndY_To_GLNDCY(this.style.fontSize) : 0.01;

        this.strObjHdl = new StringDisplayHandler(new StaticCharBlock(this.msg, new Vector2(fsW, fsH)));
        this.strObjHdl.colourTint.SetCopy(this.style.fontColour);
    },
    Update: function() {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].Update();
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
    this.sysRect = wndRect;
    this.name = name;
    this.rootObjs = [];
    this.boxMdls = [];
    this.textBlocks = [];
}
GUISystem.prototype = {
    AddGUIObject: function(guiObj) {
        /// <signature>
        ///  <summary>Add GUI objects or roots of objects, to be a part of this systems. Objects are updated and their visuals prepared when added</summary>
        ///  <param name="guiObj" type="GUIObject"></param>
        /// </signature>
        guiObj.UpdateGlobalRect(this.sysRect);
        guiObj.InstantiateDisplay();

        // Traverse added tree
        var that = this;
        function TraverseTree(parent) {
            for (var i = 0; i < parent.children.length; i++) {
                /* First Update all position information to create accurately placed models.
                * This must be done here to pass parent-to-child information */
                parent.children[i].UpdateGlobalRect(parent.rectGlobal);
                parent.children[i].InstantiateDisplay();

                TraverseTree(parent.children[i]);
            }
            // Then get the created models
            that.boxMdls.push(parent.boxHdl);
            that.textBlocks.push(parent.strObjHdl);
        }
        TraverseTree(guiObj);

        this.rootObjs.push(guiObj);
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
        GetActiveSystems: function() {
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