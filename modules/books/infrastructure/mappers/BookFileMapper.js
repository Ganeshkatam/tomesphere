"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFileMapper = void 0;
var BookFile_1 = require("../../domain/value-objects/BookFile");
var BookFileMapper = /** @class */ (function () {
    function BookFileMapper() {
    }
    BookFileMapper.toDomain = function (rawFile) {
        return BookFile_1.BookFile.create({
            id: rawFile.id,
            format: rawFile.format,
            storagePath: rawFile.storage_path,
            mimeType: rawFile.mime_type,
            checksum: rawFile.checksum || null,
            size: rawFile.size ? Number(rawFile.size) : null,
            version: rawFile.version || 1,
            isPrimary: rawFile.is_primary || false,
        });
    };
    return BookFileMapper;
}());
exports.BookFileMapper = BookFileMapper;
