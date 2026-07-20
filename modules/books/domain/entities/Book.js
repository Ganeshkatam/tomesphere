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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
var AggregateRoot_1 = require("@/shared/kernel/AggregateRoot");
var Book = /** @class */ (function (_super) {
    __extends(Book, _super);
    function Book(props) {
        var _a, _b, _c;
        return _super.call(this, props.id.value, __assign(__assign({}, props), { isPublished: (_a = props.isPublished) !== null && _a !== void 0 ? _a : false, isArchived: (_b = props.isArchived) !== null && _b !== void 0 ? _b : false, version: (_c = props.version) !== null && _c !== void 0 ? _c : 1 })) || this;
    }
    Book.create = function (props) {
        return new Book(props);
    };
    Object.defineProperty(Book.prototype, "bookId", {
        get: function () {
            return this.props.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "title", {
        get: function () {
            return this.props.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "authors", {
        get: function () {
            return this.props.authors || [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "coverUrl", {
        get: function () {
            return this.props.coverUrl || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "description", {
        get: function () {
            return this.props.description || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "genres", {
        get: function () {
            return this.props.genres || [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "isTextbook", {
        get: function () {
            return this.props.isTextbook;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "subjects", {
        get: function () {
            return this.props.subjects || [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "publishedDate", {
        get: function () {
            return this.props.publishedDate || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "pageCount", {
        get: function () {
            return this.props.pageCount || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "files", {
        get: function () {
            return __spreadArray([], this.props.files, true);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "isPublished", {
        get: function () {
            var _a;
            return (_a = this.props.isPublished) !== null && _a !== void 0 ? _a : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "isArchived", {
        get: function () {
            var _a;
            return (_a = this.props.isArchived) !== null && _a !== void 0 ? _a : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "version", {
        get: function () {
            var _a;
            return (_a = this.props.version) !== null && _a !== void 0 ? _a : 1;
        },
        enumerable: false,
        configurable: true
    });
    Book.prototype.getPrimaryFile = function () {
        return this.props.files.find(function (f) { return f.isPrimary; }) || this.props.files[0] || null;
    };
    Book.prototype.isPublicDomain = function () {
        if (!this.props.publishedDate)
            return false;
        var pubYear = new Date(this.props.publishedDate).getFullYear();
        return pubYear < 1928;
    };
    Book.prototype.matchesTitleOrAuthor = function (query) {
        var searchTerm = query.toLowerCase();
        return (this.title.toLowerCase().includes(searchTerm) ||
            this.authors.some(function (a) { return a.toLowerCase().includes(searchTerm); }));
    };
    // Mutators
    Book.prototype.updateDetails = function (updates) {
        var _this = this;
        if (this.isArchived)
            throw new Error("Cannot update an archived book.");
        Object.assign(this.props, updates);
        this.props.updatedAt = new Date();
        this.incrementVersion();
        Promise.resolve().then(function () { return __importStar(require('../events/BookEvents')); }).then(function (_a) {
            var BookUpdatedEvent = _a.BookUpdatedEvent;
            _this.addDomainEvent(new BookUpdatedEvent(_this.id, _this.version, updates));
        });
    };
    Book.prototype.publish = function () {
        var _this = this;
        if (this.isArchived)
            throw new Error("Cannot publish an archived book.");
        if (this.isPublished)
            return;
        this.props.isPublished = true;
        this.props.updatedAt = new Date();
        this.incrementVersion();
        Promise.resolve().then(function () { return __importStar(require('../events/BookEvents')); }).then(function (_a) {
            var BookPublishedEvent = _a.BookPublishedEvent;
            _this.addDomainEvent(new BookPublishedEvent(_this.id, _this.version, _this.title, _this.authors, _this.genres, 'en', // Default language
            0 // Default popularity
            ));
        });
    };
    Book.prototype.unpublish = function () {
        var _this = this;
        if (!this.isPublished)
            return;
        this.props.isPublished = false;
        this.props.updatedAt = new Date();
        this.incrementVersion();
        Promise.resolve().then(function () { return __importStar(require('../events/BookEvents')); }).then(function (_a) {
            var BookUnpublishedEvent = _a.BookUnpublishedEvent;
            _this.addDomainEvent(new BookUnpublishedEvent(_this.id, _this.version));
        });
    };
    Book.prototype.archive = function () {
        var _this = this;
        if (this.isArchived)
            return;
        this.props.isArchived = true;
        this.props.isPublished = false; // Archiving unpublishes automatically
        this.props.updatedAt = new Date();
        this.incrementVersion();
        Promise.resolve().then(function () { return __importStar(require('../events/BookEvents')); }).then(function (_a) {
            var BookArchivedEvent = _a.BookArchivedEvent;
            _this.addDomainEvent(new BookArchivedEvent(_this.id, _this.version));
        });
    };
    Book.prototype.incrementVersion = function () {
        this.props.version = this.version + 1;
    };
    Book.prototype.toJSON = function () {
        return __assign({}, this.props);
    };
    return Book;
}(AggregateRoot_1.AggregateRoot));
exports.Book = Book;
