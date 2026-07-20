"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFile = void 0;
var ValueObject_1 = require("@/shared/kernel/ValueObject");
var BookFile = /** @class */ (function (_super) {
    __extends(BookFile, _super);
    function BookFile(props) {
        return _super.call(this, props) || this;
    }
    BookFile.create = function (props) {
        return new BookFile(props);
    };
    Object.defineProperty(BookFile.prototype, "id", {
        get: function () {
            return this.props.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookFile.prototype, "format", {
        get: function () {
            return this.props.format;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookFile.prototype, "storagePath", {
        get: function () {
            return this.props.storagePath;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookFile.prototype, "mimeType", {
        get: function () {
            return this.props.mimeType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookFile.prototype, "checksum", {
        get: function () {
            return this.props.checksum;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookFile.prototype, "size", {
        get: function () {
            return this.props.size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookFile.prototype, "version", {
        get: function () {
            return this.props.version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookFile.prototype, "isPrimary", {
        get: function () {
            return this.props.isPrimary;
        },
        enumerable: false,
        configurable: true
    });
    return BookFile;
}(ValueObject_1.ValueObject));
exports.BookFile = BookFile;
