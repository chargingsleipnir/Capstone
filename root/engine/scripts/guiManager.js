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
    this.rectGlobal = wndRect.GetCopy();
    this.msg = msg;
    this.style = new MsgBoxStyle(style);

    /* Might be able to create a range of depth within the NDC, and in front
     * of everything else being affected by transformations. Maybe convert the
     * "depth" to a range of 0.00 to -0.10 */
}
GUIObject.prototype = {
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

        for (var i = 0; i < posCoords.length; i += 3) {
            // Add width and subtract height because the model is built from the centre out,
            // while the rects measure from the top-left to the bottom-right.
            posCoords[i] += (x + radialW);
            posCoords[i + 1] += (y - radialH);
        }

        this.boxHdl = new GUIBoxHandler(boxModel.vertices.byMesh);
        this.boxHdl.SetTintRGB(this.style.bgColour);
        this.boxHdl.SetTintAlpha(this.style.bgAlpha);
        if (this.style.bgTexture) {
            this.boxHdl.SetTexture(this.style.bgTexture, TextureFilters.linear);
        }


        /****************** TEXT ********************/

        if(this.msg) {

            // Adjust font width to good (readable) proportion
            var charW = this.style.fontSize * (2 / 3),
                charH = this.style.fontSize;

            // Get the exact dimensions of the text to be displayed
            var maxHeightPX = this.rectLocal.h - this.style.margin * 2;
            var maxWidthPX = charW * this.style.textMaxWidth - this.style.margin * 2;
            if (this.rectLocal.w < maxWidthPX || this.style.textMaxWidth == 0) {
                maxWidthPX = this.rectLocal.w - this.style.margin * 2;
            }

            // Turn given message into block of text within given restrictions
            var msgBlock = [];
            TextUtils.CreateBoundTextBlock(this.msg, charW, charH, this.style.textLineSpacing, maxWidthPX, maxHeightPX, msgBlock);

            // Convert sizes to NDC space
            this.charBlockModel = new StaticCharBlock(
                msgBlock,
                WndUtils.WndX_To_GLNDCX(charW),
                WndUtils.WndY_To_GLNDCY(charH),
                WndUtils.WndX_To_GLNDCX(this.style.margin),
                WndUtils.WndY_To_GLNDCY(this.style.margin),
                WndUtils.WndX_To_GLNDCX(maxWidthPX),
                WndUtils.WndY_To_GLNDCY(maxHeightPX),
                WndUtils.WndY_To_GLNDCY(this.style.textLineSpacing),
                this.style.textAlignWidth,
                this.style.textAlignHeight
            );

            // Set text block's pos to that defined in the rect
            for (var i = 0; i < this.charBlockModel.posCoords.length; i += 2) {
                // The text is built from top-left to bottom-right, so this works as-is.
                this.charBlockModel.posCoords[i] += x;
                this.charBlockModel.posCoords[i + 1] += y;
            }

            this.numChars = this.charBlockModel.count / 6;

            // Build text
            this.strHdl = new StringDisplayHandler(this.charBlockModel);
            this.strHdl.SetTintRGB(this.style.fontColour);
            this.strHdl.SetTintAlpha(this.style.fontAlpha);
            if (this.style.bold)
                this.strHdl.UseBoldTexture();
        }
        else {
            this.strHdl = new StringDisplayHandler({
                    count: 0,
                    posCoords: [],
                    colElems: [],
                    texCoords: [],
                    normAxes: []
            });
        }
    },
    UpdateMsg: function(msg) {

        var newVerts = this.charBlockModel.posCoords;
        for(var i = 0; i < this.numChars; i++) {
            newVerts = newVerts.concat(FontMap.texCoords[msg[i] || ' ']);
        }
        this.strHdl.RewriteVerts(newVerts);
    },
    AsButton: function(mousePos, clicked, Callback) {
        this.boxHdl.SetTintRGB(this.style.bgColour);
        this.strHdl.SetTintRGB(this.style.fontColour);
        if(this.rectGlobal.ContainsPoint(mousePos)) {
            this.boxHdl.SetTintRGB(this.style.bgHoverColour);
            this.strHdl.SetTintRGB(this.style.fontHoverColour);
            if(clicked) {
                Callback();
            }
        }
    },
    FadeBackground: function(incr) {
        this.boxHdl.tint.w += incr;
        return this.boxHdl.tint.w;
    },
    FadeMsg: function(incr) {
        this.strHdl.tint.w += incr;
        return this.strHdl.tint.w;
    },
    SetObjectFade: function(alpha) {
        this.boxHdl.tint.w = alpha;
        this.strHdl.tint.w = alpha;
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
    this.boxMdls = [];
    this.textBlocks = [];
}
GUISystem.prototype = {
    AddGUIObject: function(guiObj) {
        /// <signature>
        ///  <summary>Add GUI objects to be a part of this systems. Objects are updated and their visuals prepared when added</summary>
        ///  <param name="guiObj" type="GUIObject"></param>
        /// </signature>
        guiObj.UpdateGlobalRect(this.sysRect);
        guiObj.InstantiateDisplay();
        this.boxMdls.push(guiObj.boxHdl);
        this.textBlocks.push(guiObj.strHdl);
    }
};

/********** Network that controls which systems to update and draw ************/

var GUINetwork = (function() {

    var activeSystems = {};
    var inactiveSystems = {};

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
        CheckActive: function(sysName) {
            return sysName in activeSystems;
        },
        GetActiveSystems: function() {
            return activeSystems;
        },
        ListGUISystems: function() {
            for (var o in activeSystems)
                console.log('Active: ' + o + ' : ' + activeSystems[o]);
            for (var o in inactiveSystems)
                console.log('Inactive: ' + o + ' : ' + inactiveSystems[o]);
        }
    }
})();