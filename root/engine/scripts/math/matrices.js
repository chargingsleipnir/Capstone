function Matrix3(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    /// <signature>
    ///  <summary>Make 9 element identity matrix</summary>
    ///  <param name="r1c1, r1c2, r1c3, r2c1, r2c2, r2c3, r3c1, r3c2, r3c3" type="decimals">Initial values</param>
    ///  <returns type="Matrix3" />
    /// </signature>
    /// <signature>
    ///  <summary>Make 9 element identity matrix</summary>
    ///  <param name="mat3" type="Matrix3"></param>
    ///  <returns type="Matrix3" />
    /// </signature>
    /// <signature>
    ///  <summary>Make 9 element identity matrix</summary>
    ///  <returns type="Matrix3" />
    /// </signature>
    if (arguments.length == 9) {
        this.data = [
            arg0, arg1, arg2,
            arg3, arg4, arg5,
            arg6, arg7, arg8
        ];
    }
    if (arguments.length == 1) {
        this.data = [9];
        for(var i = 0; i < 9; i++)
            this.data[i] = arg0[i];
    }
    else {
        this.data = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
        ];
    }
}
Matrix3.prototype = {
    SetIdentity: function() {
        /// <signature>
        ///  <summary>Make matrix identity</summary>
        ///  <returns type="Matrix3" />
        /// </signature>
        this.data = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
        ];

        return this;
    },
    SetZero: function() {
        /// <signature>
        ///  <summary>Zero out matrix</summary>
        ///  <returns type="Matrix3" />
        /// </signature>
        for (var i = 0; i < 9; i++)
            this.data[i] = 0;

        return this;
    },
    Set: function(r1c1, r1c2, r1c3, r2c1, r2c2, r2c3, r3c1, r3c2, r3c3) {
        /// <signature>
        ///  <summary>Set matrix with row and column components</summary>
        ///  <param name="r1c1, r1c2, r1c3, r2c1, r2c2, r2c3, r3c1, r3c2, r3c3" type="decimals">Initial values</param>
        ///  <returns type="Matrix3" />
        /// </signature>
        /// <signature>
        ///  <summary>Copy all elements to those of passed Matrix</summary>
        ///  <param name="mat3" type="Matrix3"></param>
        ///  <returns type="Matrix3" />
        /// </signature>

        if (arguments.length == 9) {
            this.data = [
                r1c1, r1c2, r1c3,
                r2c1, r2c2, r2c3,
                r3c1, r3c2, r3c3
            ];
        }
        else {
            for (var i = 0; i < 9; i++)
                this.data[i] = r1c1.data[i];
        }

        return this;
    },
    Add: function(mat3) {
        /// <signature>
        ///  <summary>Adds the matrix passed</summary>
        ///  <param name="mat3" type="Matrix3">Matrix to add</param>
        ///  <returns type="Matrix3" />
        /// </signature>
        for (var i = 0; i < 9; i++)
            this.data[i] += mat3.data[i];

        return this;
    },
    Subtract: function(mat3) {
        /// <signature>
        ///  <summary>Subtract the matrix passed</summary>
        ///  <param name="mat3" type="Matrix3"></param>
        ///  <returns type="Matrix3" />
        /// </signature>
        for (var i = 0; i < 9; i++)
            this.data[i] -= mat3.data[i];

        return this;
    },
    Multiply: function(mat3) {
        /// <signature>
        ///  <summary>Multiplies the passed matrices</summary>
        ///  <param name="mat3" type="Matrix3">Matrix to multiply into the other</param>
        ///  <returns type="Matrix3" />
        /// </signature>
        var copy = this.CreateCopy();
        this.SetZero();

        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                for (var k = 0; k < 3; k++)
                    this.data[(i * 3) + j] += copy.data[(i * 3) + k] * mat3.data[j + (k * 3)];

        copy = null;
        return this;
    },
    MultiplyVec3: function(vec3) {
        /// <signature>
        ///  <summary>Multiplies the passed vector by the matrix</summary>
        ///  <param name="vec3" type="Vector3">Vector being transformed</param>
        ///  <returns type="Vector3" />
        /// </signature>

        return new Vector3(
            (this.data[0] * vec3.x) + (this.data[1] * vec3.y) + (this.data[2] * vec3.z),
            (this.data[3] * vec3.x) + (this.data[4] * vec3.y) + (this.data[5] * vec3.z),
            (this.data[6] * vec3.x) + (this.data[7] * vec3.y) + (this.data[8] * vec3.z) 
        );
    },
    Transpose: function() {
        /// <signature>
        ///  <summary>Switch rows for cols and vice versa</summary>
        ///  <returns type="Matrix3" />
        /// </signature>
        var temp = [
            this.data[1],
            this.data[2],
            this.data[5]
        ];

        this.data[1] = this.data[3];
        this.data[2] = this.data[6];
        this.data[5] = this.data[7];

        this.data[3] = temp2[0];
        this.data[6] = temp3[1];
        this.data[7] = temp6[2];

        return this;
    },
    GetCofactorMtx: function() {
        /// <signature>
        ///  <summary>Gets cofactor matrix</summary>
        ///  <returns type="Matrix3" />
        /// </signature>
        return new Matrix3(
            MathUtils.GetCofactor(this.data[4], this.data[8], this.data[7], this.data[5]),
            -MathUtils.GetCofactor(this.data[3], this.data[8], this.data[6], this.data[5]),
            MathUtils.GetCofactor(this.data[3], this.data[7], this.data[6], this.data[4]),
            -MathUtils.GetCofactor(this.data[1], this.data[8], this.data[7], this.data[2]),
            MathUtils.GetCofactor(this.data[0], this.data[8], this.data[6], this.data[2]),
            -MathUtils.GetCofactor(this.data[0], this.data[7], this.data[6], this.data[1]),
            MathUtils.GetCofactor(this.data[1], this.data[5], this.data[4], this.data[2]),
            -MathUtils.GetCofactor(this.data[0], this.data[5], this.data[3], this.data[2]),
            MathUtils.GetCofactor(this.data[0], this.data[4], this.data[2], this.data[1])
        );
    },
    GetDeterminant: function() {
        /// <signature>
        ///  <summary>Get determinant</summary>
        ///  <returns type="decimal" />
        /// </signature>
        var cofactors = [
            MathUtils.GetCofactor(this.data[4], this.data[8], this.data[7], this.data[5]),
            MathUtils.GetCofactor(this.data[3], this.data[8], this.data[6], this.data[5]),
            MathUtils.GetCofactor(this.data[3], this.data[7], this.data[6], this.data[4]),
        ];
        return (this.data[0] * cofactors[0]) - (this.data[1] * cofactors[1]) + (this.data[2] * cofactors[2]);
    },
    Invert: function() {
        /// <signature>
        ///  <summary>Invert current matrix. This * original = identity</summary>
        ///  <returns type="Matrix3" />
        /// </signature>
        var det = this.GetDeterminant();
        if (det != 0.0) {
            var detInv = 1.0 / det;
            var out = this.GetCofactorMtx();
            out.Transpose();
            for (var i = 0; i < 9; i++)
                this.data[i] = out[i] * detInv;

            return this;
        }
    },
    RotateX: function(thetaDeg) {
        /// <signature>
        ///  <summary>Rotates the matrix on the X axis</summary>
        ///  <param name="thetaDeg" type="decimal">Degree angle to rotate by</param>
        ///  <returns type="Matrix3" />
        /// </signature>
        var angle = thetaDeg * DEG_TO_RAD;

        var cosT = Math.cos(angle);
        var sinT = Math.sin(angle);

        var temp = [
            this.data[3] * cosT + this.data[6] * -sinT,
            this.data[4] * cosT + this.data[7] * -sinT,
            this.data[5] * cosT + this.data[8] * -sinT,

            this.data[3] * sinT + this.data[6] * cosT,
            this.data[4] * sinT + this.data[7] * cosT,
            this.data[5] * sinT + this.data[8] * cosT,
        ];

        for (var i = 0; i < 6; i++)
            this.data[i + 3] = temp[i];

        return this;
    },
    RotateY: function(thetaDeg) {
        /// <signature>
        ///  <summary>Rotates the matrix on the Y axis</summary>
        ///  <param name="thetaDeg" type="decimal">Degree angle to rotate by</param>
        ///  <returns type="Matrix3" />
        /// </signature>

        var angle = thetaDeg * DEG_TO_RAD;

        var cosT = Math.cos(angle);
        var sinT = Math.sin(angle);

        var temp = [
            this.data[0] * cosT + this.data[6] * sinT,
            this.data[1] * cosT + this.data[7] * sinT,
            this.data[2] * cosT + this.data[8] * sinT,

            this.data[0] * -sinT + this.data[6] * cosT,
            this.data[1] * -sinT + this.data[7] * cosT,
            this.data[2] * -sinT + this.data[8] * cosT,
        ];

        this.data[0] = temp[0];
        this.data[1] = temp[1];
        this.data[2] = temp[2];
        this.data[6] = temp[3];
        this.data[7] = temp[4];
        this.data[8] = temp[5];

        return this;
    },
    RotateZ: function(thetaDeg) {
        /// <signature>
        ///  <summary>Rotates the matrix on the Z axis</summary>
        ///  <param name="thetaDeg" type="decimal">Degree angle to rotate by</param>
        ///  <returns type="Matrix3" />
        /// </signature>

        var angle = thetaDeg * DEG_TO_RAD;

        var cosT = Math.cos(angle);
        var sinT = Math.sin(angle);

        var temp = [
            this.data[0] * cosT + this.data[3] * -sinT,
            this.data[1] * cosT + this.data[4] * -sinT,
            this.data[2] * cosT + this.data[5] * -sinT,

            this.data[0] * sinT + this.data[3] * cosT,
            this.data[1] * sinT + this.data[4] * cosT,
            this.data[2] * sinT + this.data[5] * cosT,
        ];

        for (var i = 0; i < 6; i++)
            this.data[i] = temp[i];

        return this;
    },
    Scale: function(scale) {
        /// <signature>
        ///  <summary>Scales the matrix</summary>
        ///  <param name="vec3" type="Vector3">Vector to scale each matrix x,y,z components by</param>
        ///  <returns type="Matrix3" />
        /// </signature>
        /// <signature>
        ///  <summary>Scales the matrix</summary>
        ///  <param name="scalar" type="decimal">Amount to scale each element by</param>
        ///  <returns type="Matrix3" />
        /// </signature>

        if (scale.hasOwnProperty('x')) {
            for (var i = 0; i < 3; i++) {
                this.data[i] *= scale.x;
                this.data[i + 3] *= scale.y;
                this.data[i + 6] *= scale.z;
            }
        }
        else {
            for (var i = 0; i < 3; i++)
                for (var j = 0; j < 3; j++)
                    this.data[(i * 3) + j] *= scale;
        }
        return this;
    }
}

function Matrix4(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15) {
    /// <signature>
    ///  <summary>Make 16 element identity matrix</summary>
    ///  <param name="r1c1, r1c2, r1c3, r1c4, r2c1, r2c2, r2c3, r2c4, r3c1, r3c2, r3c3, r3c4, r4c1, r4c2, r4c3, r4c4" type="decimals">Initial values</param>
    ///  <returns type="Matrix4" />
    /// </signature>
    /// <signature>
    ///  <summary>Make 16 element identity matrix</summary>
    ///  <returns type="Matrix4" />
    /// </signature>
    this.data = [
        arg0 || 1.0, arg1 || 0.0, arg2 || 0.0, arg3 || 0.0,
        arg4 || 0.0, arg5 || 1.0, arg6 || 0.0, arg7 || 0.0,
        arg8 || 0.0, arg9 || 0.0, arg10 || 1.0, arg11 || 0.0,
        arg12 || 0.0, arg13 || 0.0, arg14 || 0.0, arg15 || 1.0
    ];
}
Matrix4.prototype = {
    SetCopy: function(mat4) {
        /// <signature>
        ///  <summary>Make 16 element identity matrix</summary>
        ///  <param name="mat4" type="Matrix4"></param>
        ///  <returns type="Matrix4" />
        /// </signature>
        for (var i = 0; i < 16; i++)
            this.data[i] = mat4.data[i];

        return this;
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Get copy of this matrix</summary>
        ///  <returns type="Matrix4" />
        /// </signature>
        return new Matrix4(
            this.data[0], this.data[1], this.data[2], this.data[3],
            this.data[4], this.data[5], this.data[6], this.data[7],
            this.data[8], this.data[9], this.data[10], this.data[11],
            this.data[12], this.data[13], this.data[14], this.data[15]
        );
    },
    SetIdentity: function() {
        /// <signature>
        ///  <summary>Make matrix identity</summary>
        ///  <returns type="Matrix4" />
        /// </signature>
        this.data = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];
        return this;
    },
    SetZero: function() {
        /// <signature>
        ///  <summary>Zero out matrix</summary>
        ///  <returns type="Matrix4" />
        /// </signature>
        for (var i = 0; i < 16; i++)
            this.data[i] = 0;

        return this;
    },
    SetElems: function(r1c1, r1c2, r1c3, r1c4, r2c1, r2c2, r2c3, r2c4, r3c1, r3c2, r3c3, r3c4, r4c1, r4c2, r4c3, r4c4) {
        /// <signature>
        ///  <summary>Set matrix with row and column components</summary>
        ///  <param name="r1c1, r1c2, r1c3, r1c4, r2c1, r2c2, r2c3, r2c4, r3c1, r3c2, r3c3, r3c4, r4c1, r4c2, r4c3, r4c4" type="decimals">Initial values</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        this.data = [
            r1c1, r1c2, r1c3, r1c4,
            r2c1, r2c2, r2c3, r2c4,
            r3c1, r3c2, r3c3, r3c4,
            r4c1, r4c2, r4c3, r4c4
        ];
    },
    SetMat3: function(r1c1, r1c2, r1c3, r2c1, r2c2, r2c3, r3c1, r3c2, r3c3) {
        /// <signature>
        ///  <summary>Set upper-left Matrix3 with row and column components</summary>
        ///  <param name="r1c1, r1c2, r1c3, r2c1, r2c2, r2c3, r3c1, r3c2, r3c3" type="decimals"></param>
        ///  <returns type="Matrix4" />
        /// </signature>
        this.data[0] = r1c1; this.data[1] = r1c2; this.data[2] = r1c3;
        this.data[4] = r2c1; this.data[5] = r2c2; this.data[6] = r2c3;
        this.data[8] = r3c1; this.data[9] = r3c2; this.data[10] = r3c3;
        return this;
    },
    GetMat3: function() {
        /// <signature>
        ///  <summary>Get upper-left Matrix3</summary>
        ///  <returns type="Matrix3" />
        /// </signature>
        return new Matrix3(
            this.data[0], this.data[1], this.data[2],
            this.data[4], this.data[5], this.data[6],
            this.data[8], this.data[9], this.data[10]
        );
    },
    SetAdd: function(mat4) {
        /// <signature>
        ///  <summary>Adds the matrix passed</summary>
        ///  <param name="mat4" type="Matrix4">Matrix to add</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        for (var i = 0; i < 16; i++)
            this.data[i] += mat4.data[i];

        return this;
    },
    GetAdd: function(mat4) {
        /// <signature>
        ///  <summary>Get a new Matrix adding this with the matrix passed</summary>
        ///  <param name="mat4" type="Matrix4">Matrix to add</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var out = new Matrix4();
        for (var i = 0; i < 16; i++)
            out.data[i] = this.data[i] + mat4.data[i];

        return out;
    },
    SetSubtract: function(mat4) {
        /// <signature>
        ///  <summary>Subtract the matrix passed</summary>
        ///  <param name="mat4" type="Matrix4"></param>
        ///  <returns type="Matrix4" />
        /// </signature>
        for (var i = 0; i < 16; i++)
            this.data[i] -= mat4.data[i];

        return this;
    },
    GetSubtract: function(mat4) {
        /// <signature>
        ///  <summary>Get a new Matrix of this minus the matrix passed</summary>
        ///  <param name="mat4" type="Matrix4"></param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var out = new Matrix4();
        for (var i = 0; i < 16; i++)
            out.data[i] = this.data[i] - mat4.data[i];

        return out;
    },
    SetMultiply: function(mat4) {
        /// <signature>
        ///  <summary>Multiplies the passed matrices</summary>
        ///  <param name="mat4" type="Matrix4">Matrix to multiply into the other</param>
        ///  <returns type="Matrix4" />
        /// </signature>

        var copy = this.GetCopy();
        this.SetZero();

        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                for (var k = 0; k < 4; k++)
                    this.data[(i * 4) + j] += copy.data[(i * 4) + k] * mat4.data[j + (k * 4)];

        copy = null;
        return this;
    },
    GetMultiply: function(mat4) {
        /// <signature>
        ///  <summary>Get matrix multiplying this with the passed matrix</summary>
        ///  <param name="mat4" type="Matrix4">Matrix to multiply into the this</param>
        ///  <returns type="Matrix4" />
        /// </signature>

        var out = new Matrix4(
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0
        );

        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                for (var k = 0; k < 4; k++)
                    out.data[(i * 4) + j] += this.data[(i * 4) + k] * mat4.data[j + (k * 4)];

        return out;
    },
    GetMultiplyVec4: function(vec4)
    {
        /// <signature>
        ///  <summary>Multiplies the passed vector by the matrix</summary>
        ///  <param name="vec4" type="Vector4">Vector being transformed</param>
        ///  <returns type="Vector4" />
        /// </signature>
        return new Vector4(
            (this.data[0] * vec4.x) + (this.data[1] * vec4.y) + (this.data[2] * vec4.z) + (this.data[3] * vec4.w),
            (this.data[4] * vec4.x) + (this.data[5] * vec4.y) + (this.data[6] * vec4.z) + (this.data[7] * vec4.w),
            (this.data[8] * vec4.x) + (this.data[9] * vec4.y) + (this.data[10] * vec4.z) + (this.data[11] * vec4.w),
            (this.data[12] * vec4.x) + (this.data[13] * vec4.y) + (this.data[14] * vec4.z) + (this.data[15] * vec4.w)
        );
    },
    SetTranspose: function() {
        /// <signature>
        ///  <summary>Flip rows & cols</summary>
        ///  <returns type="Matrix4" />
        /// </signature>
        var temp = [
            this.data[1],
            this.data[2],
            this.data[3],
            this.data[6],
            this.data[7],
            this.data[11]
        ];

        this.data[1] = this.data[4];
        this.data[2] = this.data[8];
        this.data[3] = this.data[12];
        this.data[6] = this.data[9];
        this.data[7] = this.data[13];
        this.data[11] = this.data[14];

        this.data[4] = temp[0];
        this.data[8] = temp2[1];
        this.data[12] = temp3[2];
        this.data[9] = temp6[3];
        this.data[13] = temp7[4];
        this.data[14] = temp11[5];

        return this;
    },
    GetTranspose: function() {
        /// <signature>
        ///  <summary>Get this matrix with flipped rows & cols</summary>
        ///  <returns type="Matrix4" />
        /// </signature>
        return new Matrix4(
            this.data[0], this.data[4], this.data[8], this.data[12],
            this.data[1], this.data[5], this.data[9], this.data[13],
            this.data[2], this.data[6], this.data[10], this.data[14],
            this.data[3], this.data[7], this.data[11], this.data[15]
        );
    },
    SetInverse: function() { },
    GetInverse: function() { },
    GetInvMtx3: function() {
        var b01 = this.data[10] * this.data[5] - this.data[6] * this.data[9];
        var b11 = -this.data[10] * this.data[4] + this.data[6] * this.data[8];
        var b21 = this.data[9] * this.data[4] - this.data[5] * this.data[8];

        var d = this.data[0] * b01 + this.data[1] * b11 + this.data[2] * b21;

        if (!d) { return null; }

        var id = 1 / d;

        return new Matrix3(
            b01 * id,
            (-this.data[10] * this.data[1] + this.data[2] * this.data[9]) * id,
            (this.data[6] * this.data[1] - this.data[2] * this.data[5]) * id,
            b11 * id,
            (this.data[10] * this.data[0] - this.data[2] * this.data[8]) * id,
            (-this.data[6] * this.data[0] + this.data[2] * this.data[4]) * id,
            b21 * id,
            (-this.data[9] * this.data[0] + this.data[1] * this.data[8]) * id,
            (this.data[5] * this.data[0] - this.data[1] * this.data[4]) * id
        );
    },
    SetTranslateVec3: function(vec) {
        /// <signature>
        ///  <summary>Multiplies translation elements r4c1, r4c2, and r4c3 by passed vector</summary>
        ///  <param name="vec3" type="Vector3">Vector to translate the matrix by. Coord w presumed to be 1</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        for(var i = 0; i < 4; i++)
            this.data[i + 12] = (this.data[i] * vec.x) + (this.data[i + 4] * vec.y) + (this.data[i + 8] * vec.z) + this.data[i + 12];

        return this;
    },
    GetTranslateVec3: function(vec) {
        /// <signature>
        ///  <summary>Gets a matrix multiplying the translation elements r4c1, r4c2, and r4c3 by passed vector</summary>
        ///  <param name="vec3" type="Vector3">Vector to translate the matrix by. Coord w presumed to be 1</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var out = this.GetCopy();
        for (var i = 0; i < 4; i++)
            out.data[i + 12] = (this.data[i] * vec.x) + (this.data[i + 4] * vec.y) + (this.data[i + 8] * vec.z) + this.data[i + 12];

        return out;
    },
    SetTranslateVec4: function(vec) {
        /// <signature>
        ///  <summary>Multiplies translation elements r4c1, r4c2, r4c3, and r4c4 by passed vector</summary>
        ///  <param name="vec4" type="Vector4">Vector to translate the matrix by</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        for (var i = 0; i < 4; i++)
            this.data[i + 12] = (this.data[i] * vec.x) + (this.data[i + 4] * vec.y) + (this.data[i + 8] * vec.z) + (this.data[i + 12] * vec.w);

        return this;
    },
    GetTranslateVec4: function(vec) {
        /// <signature>
        ///  <summary>Gets a matrix multiplying the translation elements r4c1, r4c2, and r4c3 by passed vector</summary>
        ///  <param name="vec4" type="Vector4">Vector to translate the matrix by</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var out = this.GetCopy();
        for (var i = 0; i < 4; i++)
            out.data[i + 12] = (this.data[i] * vec.x) + (this.data[i + 4] * vec.y) + (this.data[i + 8] * vec.z) + (this.data[i + 12] * vec.w);

        return out;
    },
    SetRotateAbout: function(vec3, thetaDeg) {
        /// <signature>
        ///  <summary>Rotates on the vector axis, by the degrees provided</summary>
        ///  <param name="axis" type="Vector3">Axis to rotate on</param>
        ///  <param name="thetaDeg" type="decimal">Amount of rotation in degrees</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var axis = vec3.GetCopy();
        var angle = thetaDeg * DEG_TO_RAD;

        if (axis.GetMagSqr() < INFINITESIMAL || angle == 0)
            return;

        axis.SetNormalized();
        var 
            s, c, t,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;

        s = Math.sin(angle);
        c = Math.cos(angle);
        t = 1.0 - c;

        // Construct the elements of the rotation matrix
        b00 = axis.x * axis.x * t + c;			b01 = axis.y * axis.x * t + axis.z * s; b02 = axis.z * axis.x * t - axis.y * s;
        b10 = axis.x * axis.y * t - axis.z * s; b11 = axis.y * axis.y * t + c;			b12 = axis.z * axis.y * t + axis.x * s;
        b20 = axis.x * axis.z * t + axis.y * s; b21 = axis.y * axis.z * t - axis.x * s; b22 = axis.z * axis.z * t + c;

        // Perform rotation-specific matrix multiplication
        var temp = [
            this.data[0] * b00 + this.data[4] * b01 + this.data[8] * b02,
            this.data[1] * b00 + this.data[5] * b01 + this.data[9] * b02,
            this.data[2] * b00 + this.data[6] * b01 + this.data[10] * b02,
            this.data[3] * b00 + this.data[7] * b01 + this.data[11] * b02,
            this.data[0] * b10 + this.data[4] * b11 + this.data[8] * b12,
            this.data[1] * b10 + this.data[5] * b11 + this.data[9] * b12,
            this.data[2] * b10 + this.data[6] * b11 + this.data[10] * b12,
            this.data[3] * b10 + this.data[7] * b11 + this.data[11] * b12,
            this.data[0] * b20 + this.data[4] * b21 + this.data[8] * b22,
            this.data[1] * b20 + this.data[5] * b21 + this.data[9] * b22,
            this.data[2] * b20 + this.data[6] * b21 + this.data[10] * b22,
            this.data[3] * b20 + this.data[7] * b21 + this.data[11] * b22
        ];
        
        for (var i = 0; i < 12; i++)
            this.data[i] = temp[i];

        return this;
    },
    RotateX: function(thetaDeg) {
        /// <signature>
        ///  <summary>Rotates the matrix on the X axis</summary>
        ///  <param name="thetaDeg" type="decimal">Degree angle to rotate by</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var angle = thetaDeg * DEG_TO_RAD;

        var cosT = Math.cos(angle);
        var sinT = Math.sin(angle);

        var temp = [
            this.data[4] * cosT + this.data[8] * -sinT,
            this.data[5] * cosT + this.data[9] * -sinT,
            this.data[6] * cosT + this.data[10] * -sinT,
            this.data[7] * cosT + this.data[11] * -sinT,

            this.data[4] * sinT + this.data[8] * cosT,
            this.data[5] * sinT + this.data[9] * cosT,
            this.data[6] * sinT + this.data[10] * cosT,
            this.data[7] * sinT + this.data[11] * cosT
        ];

        for(var i = 0; i < 8; i++)
            this.data[i + 4] = temp[i];

        return this;
    },
    RotateY: function(thetaDeg) {
        /// <signature>
        ///  <summary>Rotates the matrix on the Y axis</summary>
        ///  <param name="thetaDeg" type="decimal">Degree angle to rotate by</param>
        ///  <returns type="Matrix4" />
        /// </signature>

        var angle = thetaDeg * DEG_TO_RAD;

        var cosT = Math.cos(angle);
        var sinT = Math.sin(angle);

        var temp = [
            this.data[0] * cosT + this.data[8] * sinT,
            this.data[1] * cosT + this.data[9] * sinT,
            this.data[2] * cosT + this.data[10] * sinT,
            this.data[3] * cosT + this.data[11] * sinT,
            this.data[0] * -sinT + this.data[8] * cosT,
            this.data[1] * -sinT + this.data[9] * cosT,
            this.data[2] * -sinT + this.data[10] * cosT,
            this.data[3] * -sinT + this.data[11] * cosT
        ];

        this.data[0] = temp[0];
        this.data[1] = temp[1];
        this.data[2] = temp[2];
        this.data[3] = temp[3];
        this.data[8] = temp[4];
        this.data[9] = temp[5];
        this.data[10] = temp[6];
        this.data[11] = temp[7];

        return this;
    },
    RotateZ: function(thetaDeg) {
        /// <signature>
        ///  <summary>Rotates the matrix on the Z axis</summary>
        ///  <param name="thetaDeg" type="decimal">Degree angle to rotate by</param>
        ///  <returns type="Matrix4" />
        /// </signature>

        var angle = thetaDeg * DEG_TO_RAD;

        var cosT = Math.cos(angle);
        var sinT = Math.sin(angle);

        var temp = [
            this.data[0] * cosT + this.data[4] * -sinT,
            this.data[1] * cosT + this.data[5] * -sinT,
            this.data[2] * cosT + this.data[6] * -sinT,
            this.data[3] * cosT + this.data[7] * -sinT,
            this.data[0] * sinT + this.data[4] * cosT,
            this.data[1] * sinT + this.data[5] * cosT,
            this.data[2] * sinT + this.data[6] * cosT,
            this.data[3] * sinT + this.data[7] * cosT
        ];

        for (var i = 0; i < 8; i++)
            this.data[i] = temp[i];

        return this;
    },
    SetScaleVec3: function(vec3) {
        /// <signature>
        ///  <summary>Scales the matrix</summary>
        ///  <param name="vec3" type="Vector3">Vector to scale each matrix x,y,z components by</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        for (var i = 0; i < 3; i++) {
            this.data[i] *= vec3.x;
            this.data[i + 4] *= vec3.y;
            this.data[i + 8] *= vec3.z;
        }
        return this;
    },
    SetScaleNum: function(scale) {
        /// <signature>
        ///  <summary>Scales the matrix</summary>
        ///  <param name="scalar" type="decimal">Amount to scale each element by</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                this.data[(i * 4) + j] *= scale;

        return this;
    },
    SetOrientation: function(pos, dirFwd, dirUp, space) {
        /// <signature>
        ///  <summary>Create matrix oriented by directional control</summary>
        ///  <param name="pos" type="Vector3">Location of viewer</param>
        ///  <param name="dirFwd" type="Vector3">Normalized View direction</param>
        ///  <param name="dirUp" type="Vector3">Normalized Vector 90 degrees to dirFwd, to control roll</param>
        ///  <param name="space" type="enum">Determines if orientation is local or global</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var dirSide = dirFwd.GetCross(dirUp);
        this.SetMat3(
            dirSide.x, dirUp.x, -dirFwd.x,
            dirSide.y, dirUp.y, -dirFwd.y,
            dirSide.z, dirUp.z, -dirFwd.z
        );
        if (space == Space.global) {
            this.data[12] = -dirSide.GetDot(pos);
            this.data[13] = -dirUp.GetDot(pos);
            this.data[14] = dirFwd.GetDot(pos);
        }
        else {
            this.data[12] = pos.x;
            this.data[13] = pos.y;
            this.data[14] = pos.z;
        }
        return this;
    },
    Orient: function(pos, dirFwd, dirUp) {
        /// <signature>
        ///  <summary>Create matrix oriented by directional control</summary>
        ///  <param name="pos" type="Vector3">Location of viewer</param>
        ///  <param name="dirFwd" type="Vector3">Normalized View direction</param>
        ///  <param name="dirUp" type="Vector3">Normalized Vector 90 degrees to dirFwd, to control roll</param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var dirSide = dirFwd.GetCross(dirUp);

        /*
        // Translate
        for(var i = 0; i < 4; i++)
            this.data[i + 12] = (this.data[i] * vec.x) + (this.data[i + 4] * vec.y) + (this.data[i + 8] * vec.z) + this.data[i + 12];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                this.data[(i * 3) + j] = (this.data
            }
        }
        */
    },
    SetPerspective: function(thetaDeg, aspectRatio, boundNear, boundFar) {
        /// <signature>
        ///  <summary>Perspective projection matrix</summary>
        ///  <param name="thetaDeg" type="decimal">Vertical viewing angle</param>
        ///  <param name="aspectRatio" type="decimal">Viewport width/height</param>
        ///  <param name="boundNear" type="decimal">Dist to nearest drawn vertex</param>
        ///  <param name="boundFar" type="decimal">Dist to furthest draw vertex</param>
        ///  <returns type="Matrix4" />
        /// </signature>

        var angle = thetaDeg * DEG_TO_RAD;
        var d = 1.0 / Math.tan(angle / 2.0);
        var nf = 1.0 / (boundNear - boundFar);

        this.SetElems(
            d / aspectRatio, 0.0, 0.0,                               0.0,
            0.0,             d,   0.0,                               0.0,
            0.0,             0.0, (boundFar + boundNear) * nf,       -1.0,
            0.0,             0.0, (2.0 * boundFar * boundNear) * nf, 0.0
        );
        return this;
    },
    SetOrthographic: function(left, right, bottom, top, near, far) {
        /// <signature>
        ///  <summary>Orthographic projection matrix</summary>
        ///  <param name="left" type="decimal"></param>
        ///  <param name="right" type="decimal"></param>
        ///  <param name="bottom" type="decimal"></param>
        ///  <param name="top" type="decimal"></param>
        ///  <param name="near" type="decimal"></param>
        ///  <param name="far" type="decimal"></param>
        ///  <returns type="Matrix4" />
        /// </signature>
        var lr = 1.0 / (left - right);
        var bt = 1.0 / (bottom - top);
        var nf = 1.0 / (near - far);

        this.Set(
            -2.0 * lr,           0.0,                 0.0,               0.0,
            0.0,                 -2.0 * bt,           0.0,               0.0,
            0.0,                 0.0,                 2.0 * nf,          0.0,
            (left + right) * lr, (bottom + top) * bt, (near + far) * nf, 1.0
        );
        return this;
    }
}