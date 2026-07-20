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
exports.BookArchivedEvent = exports.BookUnpublishedEvent = exports.BookDeletedEvent = exports.BookUpdatedEvent = exports.BookPublishedEvent = void 0;
var DomainEvent_1 = require("@/shared/domain/events/DomainEvent");
var BookPublishedEvent = /** @class */ (function (_super) {
    __extends(BookPublishedEvent, _super);
    function BookPublishedEvent(aggregateId, aggregateVersion, title, authors, categories, language, popularity) {
        var _this = _super.call(this, aggregateId, aggregateVersion, 1) || this;
        _this.title = title;
        _this.authors = authors;
        _this.categories = categories;
        _this.language = language;
        _this.popularity = popularity;
        _this.eventName = BookPublishedEvent.EVENT_NAME;
        Object.freeze(_this);
        return _this;
    }
    BookPublishedEvent.EVENT_NAME = "BookPublished";
    return BookPublishedEvent;
}(DomainEvent_1.DomainEvent));
exports.BookPublishedEvent = BookPublishedEvent;
var BookUpdatedEvent = /** @class */ (function (_super) {
    __extends(BookUpdatedEvent, _super);
    function BookUpdatedEvent(aggregateId, aggregateVersion, updates) {
        var _this = _super.call(this, aggregateId, aggregateVersion, 1) || this;
        _this.updates = updates;
        _this.eventName = BookUpdatedEvent.EVENT_NAME;
        Object.freeze(_this);
        return _this;
    }
    BookUpdatedEvent.EVENT_NAME = "BookUpdated";
    return BookUpdatedEvent;
}(DomainEvent_1.DomainEvent));
exports.BookUpdatedEvent = BookUpdatedEvent;
var BookDeletedEvent = /** @class */ (function (_super) {
    __extends(BookDeletedEvent, _super);
    function BookDeletedEvent(aggregateId, aggregateVersion) {
        var _this = _super.call(this, aggregateId, aggregateVersion, 1) || this;
        _this.eventName = BookDeletedEvent.EVENT_NAME;
        Object.freeze(_this);
        return _this;
    }
    BookDeletedEvent.EVENT_NAME = "BookDeleted";
    return BookDeletedEvent;
}(DomainEvent_1.DomainEvent));
exports.BookDeletedEvent = BookDeletedEvent;
var BookUnpublishedEvent = /** @class */ (function (_super) {
    __extends(BookUnpublishedEvent, _super);
    function BookUnpublishedEvent(aggregateId, aggregateVersion) {
        var _this = _super.call(this, aggregateId, aggregateVersion, 1) || this;
        _this.eventName = BookUnpublishedEvent.EVENT_NAME;
        Object.freeze(_this);
        return _this;
    }
    BookUnpublishedEvent.EVENT_NAME = "BookUnpublished";
    return BookUnpublishedEvent;
}(DomainEvent_1.DomainEvent));
exports.BookUnpublishedEvent = BookUnpublishedEvent;
var BookArchivedEvent = /** @class */ (function (_super) {
    __extends(BookArchivedEvent, _super);
    function BookArchivedEvent(aggregateId, aggregateVersion) {
        var _this = _super.call(this, aggregateId, aggregateVersion, 1) || this;
        _this.eventName = BookArchivedEvent.EVENT_NAME;
        Object.freeze(_this);
        return _this;
    }
    BookArchivedEvent.EVENT_NAME = "BookArchived";
    return BookArchivedEvent;
}(DomainEvent_1.DomainEvent));
exports.BookArchivedEvent = BookArchivedEvent;
