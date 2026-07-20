"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMapper = void 0;
var Book_1 = require("../../domain/entities/Book");
var value_objects_1 = require("../../domain/value-objects");
var BookFileMapper_1 = require("./BookFileMapper");
var BookMapper = /** @class */ (function () {
    function BookMapper() {
    }
    BookMapper.toDomain = function (raw) {
        var _a, _b, _c;
        return Book_1.Book.create({
            id: value_objects_1.BookId.create(raw.id),
            title: raw.title,
            authors: ((_a = raw.book_authors) === null || _a === void 0 ? void 0 : _a.map(function (ba) { var _a; return (_a = ba.authors) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean)) || [],
            coverUrl: raw.cover_url,
            description: raw.description,
            genres: ((_b = raw.book_genres) === null || _b === void 0 ? void 0 : _b.map(function (bg) { var _a; return (_a = bg.genres) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean)) || [],
            publishedDate: raw.release_date,
            pageCount: raw.pages,
            isTextbook: raw.is_textbook || false,
            subjects: ((_c = raw.book_subjects) === null || _c === void 0 ? void 0 : _c.map(function (bs) { var _a; return (_a = bs.subjects) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean)) || [],
            files: (raw.book_files || []).map(BookFileMapper_1.BookFileMapper.toDomain),
            createdAt: raw.created_at ? new Date(raw.created_at) : new Date(),
            updatedAt: raw.updated_at || raw.created_at
                ? new Date((raw.updated_at || raw.created_at))
                : new Date(),
        });
    };
    BookMapper.toPersistence = function (domain) {
        var _a, _b, _c, _d;
        return {
            id: domain.bookId.value,
            title: domain.title,
            // We don't map arrays back to BookRow here, persistence of many-to-many 
            // is handled in the Repository itself by inserting into junction tables.
            cover_url: (_a = domain.coverUrl) !== null && _a !== void 0 ? _a : undefined,
            description: (_b = domain.description) !== null && _b !== void 0 ? _b : undefined,
            is_textbook: domain.isTextbook,
            is_published: domain.isPublished,
            is_archived: domain.isArchived,
            version: domain.version,
            release_date: (_c = domain.publishedDate) !== null && _c !== void 0 ? _c : undefined,
            pages: (_d = domain.pageCount) !== null && _d !== void 0 ? _d : undefined,
        };
    };
    return BookMapper;
}());
exports.BookMapper = BookMapper;
