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
exports.BookId = void 0;
var ValueObject_1 = require("@/shared/kernel/ValueObject");
var DomainError_1 = require("@/shared/kernel/DomainError");
var BookId = /** @class */ (function (_super) {
    __extends(BookId, _super);
    function BookId(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(BookId.prototype, "value", {
        get: function () {
            return this.props.value;
        },
        enumerable: false,
        configurable: true
    });
    BookId.create = function (id) {
        if (!id || id.trim().length === 0) {
            throw new DomainError_1.ValidationError("BookId cannot be empty");
        }
        return new BookId({ value: id });
    };
    return BookId;
}(ValueObject_1.ValueObject));
exports.BookId = BookId;
