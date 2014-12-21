
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

    this.u_tint;
    this.u_Sampler;
    this.u_Alpha;

    this.u_DiffCol;
    this.u_DiffInt;
    this.u_SpecCol;
    this.u_SpecInt;

    this.u_AmbBright;
    this.u_DirBright;
    this.u_DirDir;
    this.u_PntBright;
    this.u_PntPos;

    this.u_MtxModel;
    this.u_MtxProj;
    this.u_MtxCam;
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

var Time = {
    delta_Milli: 0.0,
    fps: 0.0
};

/***** ENUMS *****/
var DrawMethods = { points: 1, lines: 2, triangles: 3, triangleFan: 4, triangleStrip: 5 };
var Components = { modelHandler: 1, collisionBody: 2, rigidBody: 3 };
var Labels = { none: 0, testObject: 1, productionEnvironment: 2, light: 3, camera: 4 };
var Space = { local: 0, global: 1 };
var BoundingShapes = { sphere: 0, aabb: 1 };
var Planes = { left: 0, right: 1, bottom: 2, top: 3, far: 4, near: 5 };
var MoveMethod = { input: 0, physics: 1, script: 2 };

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
var DEBUG = true;
var GUI_ACTIVE = false;
var DEG_TO_RAD = Math.PI / 180.0;
var RAD_TO_DEG = 180.0 / Math.PI;
var INFINITESIMAL = 1.0e-9;
var GRAVITY = new Vector3(0.0, -10.0, 0.0);
var GBL_FWD = new Vector3(0.0, 0.0, -1.0);
var GBL_BACK = new Vector3(0.0, 0.0, 1.0);
var GBL_LEFT = new Vector3(-1.0, 0.0, 0.0);
var GBL_RIGHT = new Vector3(1.0, 0.0, 0.0);
var GBL_DOWN = new Vector3(0.0, -1.0, 0.0);
var GBL_UP = new Vector3(0.0, 1.0, 0.0);