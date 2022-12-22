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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const puppeteer_1 = __importDefault(require("puppeteer"));
const tiktokurl = `https://www.tiktok.com/`;
const api = {
    fethUser: (username) => __awaiter(void 0, void 0, void 0, function* () {
        let data = { followers: 0, following: 0, likes: 0 };
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto(`${tiktokurl}${username}`);
        //name
        const name = yield page.$("[data-e2e='user-subtitle']");
        data.name = yield (yield name.getProperty("textContent")).jsonValue();
        //following
        const following = yield page.$("[data-e2e='following-count']");
        data.following = api.convertNumberAbbreviation(yield (yield following.getProperty("textContent")).jsonValue());
        //followers
        const followers = yield page.$("[data-e2e='followers-count']");
        data.followers = api.convertNumberAbbreviation(yield (yield followers.getProperty("textContent")).jsonValue());
        //likes
        const likes = yield page.$("[data-e2e='likes-count']");
        data.likes = api.convertNumberAbbreviation(yield (yield likes.getProperty("textContent")).jsonValue());
        //bio 
        const bio = yield page.$("[data-e2e='user-bio']");
        data.bio = yield (yield bio.getProperty("textContent")).jsonValue();
        //profile 
        data.profile = yield page.$eval(".tiktok-1zpj2q-ImgAvatar", e => e.getAttribute('src'));
        yield browser.close();
        return data;
    }),
    followUSer: (username) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    convertNumberAbbreviation: (str) => {
        const regex = /^([\d.]+)([a-z]+)$/i;
        const match = regex.exec(str);
        if (!match) {
            return parseInt(str);
        }
        const value = parseFloat(match[1]);
        const abbreviation = match[2].toLowerCase();
        switch (abbreviation) {
            case 'k':
                return value * 1000;
            case 'm':
                return value * 1000000;
            case 'b':
                return value * 1000000000;
            default:
                return parseInt(str);
        }
    }
};
exports.default = api;
