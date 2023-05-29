"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const swagger_1 = __importDefault(require("./utils/swagger"));
exports.app = (0, express_1.default)();
// Authorize Login
const authLogins_1 = __importDefault(require("./middleware/authLogins"));
(0, authLogins_1.default)(passport_1.default);
// Public Folder
exports.app.use(express_1.default.static('./public'));
// EJS
exports.app.use(express_ejs_layouts_1.default);
exports.app.set('view engine', 'ejs');
// Bodyparser
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
// Express Session
exports.app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
// Passport middleware
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
// Connect flash
exports.app.use((0, connect_flash_1.default)());
// Global Variables for flash messages
exports.app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Routes
exports.app.use('/', index_1.default);
exports.app.use('/', users_1.default);
exports.port = process.env.PORT ? Number(process.env.PORT) : 3001;
exports.app.listen(exports.port, () => {
    console.log(`Server running on port ${exports.port}`);
    (0, swagger_1.default)(exports.app, exports.port);
});
