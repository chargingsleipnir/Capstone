﻿
/***** STRUCTS *****/
function ShaderFilePair(name, vshdr, fshder) {
    /// <signature>
    ///  <summary>Structure for string vert and frag shaders</summary>
    ///  <param name="name" type="string">name of program using these shaders</param>
    ///  <param name="vshdr" type="string">vertex shader string</param>
    ///  <param name="fshdr" type="string">fragment shader string</param>
    /// </signature>
    this.name = name;
    this.vert = vshdr;
    this.frag = fshder;
}
function ShaderProgramData() {
    /// <signature>
    ///  <summary>Structure for attrib and unfiorm ids</summary>
    /// </signature>
    this.program;

    this.a_Pos;
    this.a_Col;
    this.a_TexCoord;
    this.a_Norm;

    this.u_Tint;
    this.u_Sampler;
    this.u_Alpha;

    this.u_DiffColWeight;
    this.u_SpecCol;
    this.u_SpecInt;

    this.u_AmbBright;
    this.u_DirBright;
    this.u_DirDir;
    this.u_PntBright;
    this.u_PntPos;
    this.u_CamPos;

    this.u_MtxM;
    this.u_MtxVP;
    this.u_MtxMVP;
    this.u_MtxNorm;
}
function BufferData() {
    /// <signature>
    ///  <summary>Structure for buffer objects</summary>
    /// </signature>
    this.VBO;
    this.EABO;
    this.texID;
    // Use these to jump certain distance into buffer
    this.VAOBytes;
    this.numVerts;
    this.lenPosCoords;
    this.lenColElems;
    this.lenTexCoords;
    this.lenNormAxes;
}
function ControlScheme() {
    this.moveLeft;
    this.moveRight;
    this.moveDown;
    this.moveUp;
    this.moveBack;
    this.moveForth;
    this.pitchDown;
    this.pitchUp;
    this.yawLeft;
    this.yawRight;
}
function MsgBoxStyle(style) {
    // This is height in px. Width will be 2/3 this value
    this.fontSize = 20.0;
    this.fontColour = new Vector3();
    this.textMaxWidth = 100;
    this.textAlignWidth = Alignment.centre;
    this.textAlignHeight = Alignment.centre;
    this.textLineSpacing = 0.0;
    this.bgTexture = null;
    this.bgColour = new Vector3();
    this.bgAlpha = 1.0;
    this.margin = 0.5;
    this.bold = false;

    if(style) {
        this.fontSize = style.fontSize;
        this.fontColour = style.fontColour.GetCopy();
        this.textMaxWidth = style.textMaxWidth;
        this.textAlignWidth = style.textAlignWidth;
        this.textAlignHeight = style.textAlignHeight;
        this.textLineSpacing = style.textLineSpacing;
        this.bgTexture = style.bgTexture;
        this.bgColour = style.bgColour.GetCopy();
        this.bgAlpha = style.bgAlpha;
        this.margin = style.margin;
        this.bold = style.bold;
    }
}

var Time = {
    delta_Milli: 0.0,
    fps: 0.0
};

/***** ENUMS *****/
var DrawMethods = { points: 1, lines: 2, triangles: 3, triangleFan: 4, triangleStrip: 5 };
var Components = { camera: 0, collisionBody: 1, rigidBody: 2 };
var Labels = { none: 0, testObject: 1, productionEnvironment: 2, light: 3, camera: 4 };
var GUILabels = { container: 0, msg: 1, btn: 2 };
var Space = { local: 0, global: 1 };
var BoundingShapes = { sphere: 0, aabb: 1 };
var Planes = { left: 0, right: 1, bottom: 2, top: 3, far: 4, near: 5 };
var MoveMethod = { input: 0, physics: 1, script: 2 };
var TextureFilters = { nearest: 0, linear: 1, mipmap: 2 };
var Alignment = { left: 0, centre: 0.5, right: 1, bottom: 1, top: 0 };

var KeyMap = {
    Backspace: 8, Tab: 9, Enter: 13, Shift: 16, Ctrl: 17, Alt: 18, CapsLock: 20, Esc: 27,
    SpaceBar: 32, PgUp: 33, PgDown: 34, End: 35, Home: 36,
    ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40,
    Insert: 45, Delete: 46,
    Num0: 48, Num1: 49, Num2: 50, Num3: 51, Num4: 52, Num5: 53, Num6: 54, Num7: 55, Num8: 56, Num9: 57,
    A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73,
    J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82,
    S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
    F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123,
    SemiColon: 59, EqualSign: 61, MinusSign: 173, Comma: 188, Dash: 189, Period: 190, SlashForward: 191, Tilda: 192,
    BracketOpen: 219, SlashBack: 220, BracketClose: 221, QuoteSingle: 222
};

/***** CONSTS *****/
var DEG_TO_RAD = Math.PI / 180.0;
var RAD_TO_DEG = 180.0 / Math.PI;
var INFINITESIMAL = 1.0e-9;
var VEC3_ZERO = new Vector3();
var VEC3_GRAVITY = new Vector3(0.0, -10.0, 0.0);
var VEC3_FWD = new Vector3(0.0, 0.0, -1.0);
var VEC3_BACK = new Vector3(0.0, 0.0, 1.0);
var VEC3_LEFT = new Vector3(-1.0, 0.0, 0.0);
var VEC3_RIGHT = new Vector3(1.0, 0.0, 0.0);
var VEC3_DOWN = new Vector3(0.0, -1.0, 0.0);
var VEC3_UP = new Vector3(0.0, 1.0, 0.0);

var ShdrLines = {
    prec: {
        medF: "precision mediump float;\n\n"
    },
    attr: {
        pos: "attribute vec3 a_Pos;\n",
        col: "attribute vec3 a_Col;\n",
        tex: "attribute vec2 a_TexCoord;\n",
        norm: "attribute vec3 a_Norm;\n"
    },
    vary: {
        pos: "varying vec4 v_Pos;\n",
        col: "varying vec3 v_Col;\n",
        tex: "varying vec2 v_TexCoord;\n",
        norm: "varying vec3 v_TrfmNorm;\n",
        light: "varying vec3 v_LightWeight;\n",
        sendPos: "v_Pos = u_MtxM * vec4(a_Pos, 1.0);\n",
        sendCol: "v_Col = a_Col;\n",
        sendTex: "v_TexCoord = a_TexCoord;\n",
        sendNorm: "v_TrfmNorm = u_MtxNorm * a_Norm;\n",
        sendLight: "v_LightWeight = ambCol + dirCol + pntCol;\n"
    },
    unif: {
        mtxM: "uniform mat4 u_MtxM;\n",
        mtxVP: "uniform mat4 u_MtxVP;\n",
        mtxMVP: "uniform mat4 u_MtxMVP;\n",
        mtxNorm: "uniform mat3 u_MtxNorm;\n",
        tint: "uniform vec3 u_Tint;\n",
        alpha: "uniform float u_Alpha;\n",
        sampler: "uniform sampler2D u_Sampler;\n",
        lighting: "uniform vec3 u_DiffColWeight;\n" +
            "uniform vec3 u_SpecCol;\n" +
            "uniform float u_SpecInt;\n\n" +
            "uniform float u_AmbBright;\n" +
            "uniform float u_DirBright;\n" +
            "uniform vec3 u_DirDir;\n" +
            "uniform float u_PntBright;\n" +
            "uniform vec3 u_PntPos;\n\n",
        camPos: "uniform vec3 u_CamPos;\n"
    },
    main: {
        start: "void main()\n" + "{\n",
        pntSize: "gl_PointSize = 5.0;\n",
        glPos: {
            MVP: "gl_Position = u_MtxMVP * vec4(a_Pos, 1.0);\n",
            Split: "gl_Position = u_MtxVP * v_Pos;\n"
        },
        texCol: "vec4 texColour = texture2D(u_Sampler, vec2(v_TexCoord.s, v_TexCoord.t));\n",
        normalizeNorm: "vec3 normal = normalize(v_TrfmNorm);\n",
        lighting: "float dirWeight = 0.0;\n" +
            "float pntWeight = 0.0;\n" +
            "\n" +
            "vec3 specColWeight = vec3(0.0, 0.0, 0.0);\n" +
            "float specBright = 0.0;\n" +
            "\n" +
            "vec3 ambCol = u_DiffColWeight * u_AmbBright;\n" +
            "vec3 dirCol = vec3(0.0, 0.0, 0.0);\n" +
            "vec3 pntCol = vec3(0.0, 0.0, 0.0);\n" +
            "\n" +
            "vec3 eyeDir = normalize(u_CamPos - v_Pos.xyz);\n" +
            "vec3 reflDir = vec3(0.0, 0.0, 0.0);\n" +
            "\n" +
            "if(u_DirBright > 0.0) {\n" +
            "reflDir = reflect(-u_DirDir, v_TrfmNorm);\n" +
            "specBright = pow(max(dot(reflDir, eyeDir), 0.0), u_SpecInt);\n" +
            "specColWeight = u_SpecCol * specBright;\n" +
            "\n" +
            "dirWeight = max(dot(v_TrfmNorm, u_DirDir), 0.0) * u_DirBright;\n" +
            "\n" +
            "dirCol = (u_DiffColWeight * dirWeight) + (specColWeight * dirWeight);\n}\n" +
            "\n" +
            "if(u_PntBright > 0.0) {\n" +
            "vec3 pntDir = normalize(u_PntPos - v_Pos.xyz);\n" +
            "reflDir = reflect(-pntDir, v_TrfmNorm);\n" +
            "specBright = pow(max(dot(reflDir, eyeDir), 0.0), u_SpecInt);\n" +
            "specColWeight = u_SpecCol * specBright;\n" +
            "\n" +
            "pntWeight = max(dot(v_TrfmNorm, pntDir), 0.0) * u_PntBright;\n" +
            "\n" +
            "pntCol = (u_DiffColWeight * pntWeight) + (specColWeight * pntWeight);\n}\n" +
            "\n",
        glFrag: {
            start: "gl_FragColor = vec4(",
            tint: "u_Tint",
            col: " + v_Col",
            tex: " + texColour.rgb",
            light: " * v_LightWeight",
            end: ", 1.0);\n"
        },
        end: "}"
    }
};