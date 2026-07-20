"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseBookRepository = void 0;
var BookMapper_1 = require("./mappers/BookMapper");
var SupabaseBookRepository = /** @class */ (function () {
    function SupabaseBookRepository(client) {
        this.client = client;
    }
    SupabaseBookRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from("books")
                            .select("*, book_authors(authors(name)), book_genres(genres(name)), book_subjects(subjects(name)), book_files(*)")
                            .eq("id", id.value)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error || !data) {
                            // Depending on the domain, we might throw a custom DomainError here,
                            // but returning null is acceptable for 'not found'.
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, BookMapper_1.BookMapper.toDomain(data)];
                }
            });
        });
    };
    SupabaseBookRepository.prototype.search = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var dbQuery, limit, _a, data, error, count;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dbQuery = this.client.from("books").select("*, book_authors(authors(name)), book_genres(genres(name)), book_subjects(subjects(name)), book_files(*)", { count: "exact" });
                        if (query.term) {
                            // Because full-text search requires exact matches or lexemes,
                            // fallback to ilike if textSearch isn't heavily configured yet,
                            // or use simple textSearch. For the old behavior:
                            dbQuery = dbQuery.or("title.ilike.%".concat(query.term, "%,author.ilike.%").concat(query.term, "%,description.ilike.%").concat(query.term, "%"));
                        }
                        if (query.genre && query.genre.length > 0) {
                            dbQuery = dbQuery.in("genre", query.genre);
                        }
                        if (query.limit) {
                            dbQuery = dbQuery.limit(query.limit);
                        }
                        if (query.offset) {
                            limit = query.limit || 50;
                            dbQuery = dbQuery.range(query.offset, query.offset + limit - 1);
                        }
                        return [4 /*yield*/, dbQuery];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                        if (error || !data) {
                            return [2 /*return*/, { items: [], totalCount: 0 }];
                        }
                        return [2 /*return*/, {
                                items: data.map(BookMapper_1.BookMapper.toDomain),
                                totalCount: count !== null && count !== void 0 ? count : undefined,
                            }];
                }
            });
        });
    };
    SupabaseBookRepository.prototype.getTrending = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var books;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from("books")
                            .select("*, book_authors(authors(name)), book_genres(genres(name)), book_subjects(subjects(name)), book_files(*)")
                            .limit(query.limit)
                            .order("view_count", { ascending: false, nullsFirst: false })];
                    case 1:
                        books = (_a.sent()).data;
                        return [2 /*return*/, (books || []).map(BookMapper_1.BookMapper.toDomain)];
                }
            });
        });
    };
    SupabaseBookRepository.prototype.save = function (book) {
        return __awaiter(this, void 0, void 0, function () {
            var events, bookProps, serializedBook, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        events = book.pullDomainEvents().map(function (e) { return ({
                            aggregate_type: 'book',
                            aggregate_id: e.aggregateId,
                            event_type: e.eventName,
                            event_version: e.aggregateVersion,
                            payload: JSON.parse(JSON.stringify(e)),
                            occurred_at: e.occurredAt.toISOString(),
                        }); });
                        bookProps = book.toJSON();
                        serializedBook = {
                            id: bookProps.id.value,
                            title: bookProps.title,
                            description: bookProps.description || null,
                            is_textbook: bookProps.isTextbook,
                            is_published: bookProps.isPublished,
                            is_archived: bookProps.isArchived,
                            created_at: bookProps.createdAt.toISOString(),
                            updated_at: bookProps.updatedAt.toISOString(),
                        };
                        return [4 /*yield*/, this.client.rpc('save_book_aggregate_with_events', {
                                p_book: serializedBook,
                                p_events: events.length > 0 ? events : null
                            })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error("[SupabaseBookRepository] Failed to save book aggregate:", error);
                            throw new Error("Failed to save book: ".concat(error.message));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SupabaseBookRepository;
}());
exports.SupabaseBookRepository = SupabaseBookRepository;
