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
var supabase_js_1 = require("@supabase/supabase-js");
var SupabaseBookRepository_1 = require("../modules/books/infrastructure/SupabaseBookRepository");
var value_objects_1 = require("../modules/books/domain/value-objects");
var Book_1 = require("../modules/books/domain/entities/Book");
var dotenv_1 = require("dotenv");
try {
    (0, dotenv_1.config)({ path: ".env.local" });
}
catch (e) { }
var supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var repo, idStr, book1, b1, b2, err_1, outbox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    repo = new SupabaseBookRepository_1.SupabaseBookRepository(supabase);
                    idStr = "550e8400-e29b-41d4-a716-446655440000";
                    book1 = Book_1.Book.create({
                        id: value_objects_1.BookId.create(idStr),
                        title: "Concurrency Test Book",
                        authors: [],
                        genres: [],
                        subjects: [],
                        description: "description",
                        isTextbook: false,
                        files: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    return [4 /*yield*/, repo.save(book1)];
                case 1:
                    _a.sent();
                    console.log("Book 1 saved, version:", book1.version);
                    return [4 /*yield*/, repo.findById(value_objects_1.BookId.create(idStr))];
                case 2:
                    b1 = _a.sent();
                    return [4 /*yield*/, repo.findById(value_objects_1.BookId.create(idStr))];
                case 3:
                    b2 = _a.sent();
                    // Editor A updates and saves
                    b1.updateDetails({ title: "Editor A title" });
                    return [4 /*yield*/, repo.save(b1)];
                case 4:
                    _a.sent();
                    console.log("Editor A saved successfully");
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    b2.updateDetails({ title: "Editor B title" });
                    return [4 /*yield*/, repo.save(b2)];
                case 6:
                    _a.sent();
                    console.log("Editor B saved unexpectedly!");
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.log("Editor B save failed as expected:", err_1.message);
                    return [3 /*break*/, 8];
                case 8: return [4 /*yield*/, supabase.from("outbox_messages").select("*").eq("aggregate_id", idStr)];
                case 9:
                    outbox = (_a.sent()).data;
                    console.log("Outbox events for this book:", outbox === null || outbox === void 0 ? void 0 : outbox.length);
                    return [2 /*return*/];
            }
        });
    });
}
run().catch(console.error);
