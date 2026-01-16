--
-- PostgreSQL database dump
--

\restrict a0kZyZ7GTv9FhijDP66I5CgNgx3eWNr0zxhtBqJdfuWGBZlQRzKfpsgkdL1BPbh

-- Dumped from database version 17.5 (aa1f746)
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: PurchaseCardStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."PurchaseCardStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUND'
);


ALTER TYPE public."PurchaseCardStatus" OWNER TO neondb_owner;

--
-- Name: PurchaseGameStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."PurchaseGameStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUND'
);


ALTER TYPE public."PurchaseGameStatus" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO neondb_owner;

--
-- Name: article; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.article (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    keywords text DEFAULT ''::text NOT NULL,
    slug text NOT NULL,
    "coverImage" text,
    content text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.article OWNER TO neondb_owner;

--
-- Name: card; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.card (
    id text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    icon text DEFAULT '-'::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.card OWNER TO neondb_owner;

--
-- Name: card_option; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.card_option (
    id text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    "priceVip" numeric(10,2) DEFAULT 0 NOT NULL,
    "priceAgent" numeric(10,2) DEFAULT 0 NOT NULL,
    cost numeric(10,2) DEFAULT 0 NOT NULL,
    "gameCode" text,
    "packageCode" text,
    icon text DEFAULT ''::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "cardId" text NOT NULL
);


ALTER TABLE public.card_option OWNER TO neondb_owner;

--
-- Name: featured_product; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.featured_product (
    id text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.featured_product OWNER TO neondb_owner;

--
-- Name: game; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.game (
    id text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    icon text DEFAULT '-'::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isPlayerId" boolean DEFAULT false NOT NULL,
    "isServer" boolean DEFAULT false NOT NULL,
    "playerFieldName" text DEFAULT 'UID'::text NOT NULL
);


ALTER TABLE public.game OWNER TO neondb_owner;

--
-- Name: mix_package; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mix_package (
    id text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    "priceVip" numeric(10,2) DEFAULT 0 NOT NULL,
    "priceAgent" numeric(10,2) DEFAULT 0 NOT NULL,
    cost numeric(10,2) DEFAULT 0 NOT NULL,
    icon text DEFAULT ''::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "gameId" text NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL
);


ALTER TABLE public.mix_package OWNER TO neondb_owner;

--
-- Name: package; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.package (
    id text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    "priceVip" numeric(10,2) DEFAULT 0 NOT NULL,
    "priceAgent" numeric(10,2) DEFAULT 0 NOT NULL,
    cost numeric(10,2) DEFAULT 0 NOT NULL,
    "gameCode" text,
    "packageCode" text,
    icon text DEFAULT ''::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "gameId" text NOT NULL
);


ALTER TABLE public.package OWNER TO neondb_owner;

--
-- Name: product; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product (
    id text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    pricevip double precision NOT NULL,
    agent_price double precision NOT NULL,
    img text DEFAULT '-'::text NOT NULL,
    des text DEFAULT ''::text NOT NULL,
    category text DEFAULT ''::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product OWNER TO neondb_owner;

--
-- Name: product_price; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_price (
    id text NOT NULL,
    "productId" text NOT NULL,
    price double precision NOT NULL,
    "updatedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_price OWNER TO neondb_owner;

--
-- Name: purchase_card; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_card (
    id text NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    paid numeric(10,2) DEFAULT 0 NOT NULL,
    status public."PurchaseCardStatus" DEFAULT 'PENDING'::public."PurchaseCardStatus" NOT NULL,
    "beforeBalance" numeric(10,2) DEFAULT 0 NOT NULL,
    "afterBalance" numeric(10,2) DEFAULT 0 NOT NULL,
    content text,
    "wepayTxnId" text,
    "operatorId" text,
    "wepayTxnMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "cardOptionId" text
);


ALTER TABLE public.purchase_card OWNER TO neondb_owner;

--
-- Name: purchase_game; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_game (
    id text NOT NULL,
    paid numeric(10,2) DEFAULT 0 NOT NULL,
    status public."PurchaseGameStatus" DEFAULT 'PENDING'::public."PurchaseGameStatus" NOT NULL,
    "beforeBalance" numeric(10,2) DEFAULT 0 NOT NULL,
    "afterBalance" numeric(10,2) DEFAULT 0 NOT NULL,
    content text,
    "wepayTxnId" text,
    "operatorId" text,
    "wepayTxnMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "packageId" text,
    "playerId" text,
    "serverId" text,
    "mixPackageId" text
);


ALTER TABLE public.purchase_game OWNER TO neondb_owner;

--
-- Name: purchase_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_history (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "productName" text NOT NULL,
    price double precision NOT NULL,
    prize text NOT NULL,
    reference text NOT NULL,
    status text DEFAULT 'success'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.purchase_history OWNER TO neondb_owner;

--
-- Name: redeem_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.redeem_history (
    id text NOT NULL,
    "payloadHash" text NOT NULL,
    amount double precision NOT NULL,
    "userId" text NOT NULL,
    "redeemedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.redeem_history OWNER TO neondb_owner;

--
-- Name: server; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.server (
    id text NOT NULL,
    name text NOT NULL,
    "serverCode" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "gameId" text NOT NULL
);


ALTER TABLE public.server OWNER TO neondb_owner;

--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: user; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    role text DEFAULT 'user'::text NOT NULL
);


ALTER TABLE public."user" OWNER TO neondb_owner;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public.verification OWNER TO neondb_owner;

--
-- Name: verified_slip; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.verified_slip (
    id text NOT NULL,
    "payloadHash" text NOT NULL,
    "transRef" text NOT NULL,
    amount double precision NOT NULL,
    "userId" text NOT NULL,
    "verifiedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.verified_slip OWNER TO neondb_owner;

--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
Pm1GVPMN9lLYR4Me9TVB0OXXnXrE7uDF	110579880142877180019	google	KFnvOzIRi0AHl81vcQO2vD0jy93kzBP5	ya29.A0ATi6K2tyB1fM6mZj_v2GpnH59k4eo7joj4F1JBFNAqv1LOhNiRsyk-7wvQIuPXbLSFnpMWRdjs9pnRh4HrYMWptl7Y42eP0sqlGmNdRRjQcXn9PywLGHxpu47Sb505iyvf7YuGzlUJP7xrEhW227j6Yf6SWPE15oSnLAUpEQI1lpFPIqA4vXg5zvkjWPSIR5E-_A2FgT-DYKjO130rZYcD0A1JtMApUOTsn-Nvg12zRQAeDHJrqiqd8F-7FwHCwY9mtHiG05Bk6FoqhWZOjTk5DWuFq-jISvaCgYKAXwSARESFQHGX2MiKVa2wyVFGnpcxsIYFndK0g0295	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1NzMzYmJiZDgxOGFhNWRiMTk1MTk5Y2Q1NjhlNWQ2ODUxMzJkM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA1Nzk4ODAxNDI4NzcxODAwMTkiLCJlbWFpbCI6ImNhcHNvdWxzaG9wekBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ing5dnBEMkJ6cThIb0dxWFlqSG5tVkEiLCJuYW1lIjoiY2Fwc291bCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMS1hPcmdvaTVZSExMRGd0RGZVeXJsRldFMXZXTmdIZWZQS3hybFk2NmxlT0Y0TlE9czk2LWMiLCJnaXZlbl9uYW1lIjoiY2Fwc291bCIsImlhdCI6MTc2Mzg5NjkyNywiZXhwIjoxNzYzOTAwNTI3fQ.FCeRYz_WIcWlqZpWYlvJzDV4M_GCZ9-C4NvU1QKRyFCqMa4BXnaDrq0uvU4HPmpK7wRc_bmVNbXlTetMTUZt_GaDbsNv1KbQbw23_z_Dfg9XIYz1MxS2ntYUiCdNFRhfjGbxhjLlxTzq49qMCO5aTuJ5NNI2w9DZMp7NNIKMoX34O7N57ZBOhoNfXTCYst8_jaE8QeGVZlTRTNvTBw8tfIjE4tLkPTkHz78jPgdwVxZy_W700pY-gfTLmhViIE6cFUEEhrMpXYfYNHgpiedcW9IjPMeh6wtm5Boc1a9ZSTF_p5p-ONRH4Ivi1b88Y6ZUnne6SPwgYqndVJpa2jxoIw	2025-11-23 12:22:05.277	\N	https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid	\N	2025-10-06 11:06:41.324	2025-11-23 11:22:07.423
pGCgmGgYarco6SLs0VXb7ewIwirp2ZRr	110842407669332456767	google	l4V98TiNEXefmfEnHHreuNKlEq7ApSmr	ya29.a0AQQ_BDR2LwHbDryobFlsAnLIv2JKDsNz3tpN1ElDfff6x8COYceUL0RM8vNMln6GJhl_-9QNJiIFUTa5oj8h6fVudhLJBJaNn3rr7V6UC-Rvu3cjDByG7hfSs7eVcpHnUd5PApiwyLHoBICJKtJOLobQVYPzjrgwJXdoBPOfMrF7UzExfoKkcJfK_B25qVaZ7k6t9bsaCgYKAYISARASFQHGX2MixATnSZPL_hnloGB1Me_pJA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImZiOWY5MzcxZDU3NTVmM2UzODNhNDBhYjNhMTcyY2Q4YmFjYTUxN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA4NDI0MDc2NjkzMzI0NTY3NjciLCJlbWFpbCI6InJvbm5ha3JpdG5vb2sxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiQnRTNkdWSzh1QVdOZzhaRWxBT2JodyIsIm5hbWUiOiJyb25uYWtyaXQgY2hlaW52aWNoYWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTERRZXVfazdnai1UWVZmaFA5a0dWc3BmOFFESmRvZDNyU0FUYXdoTEpmbWdfX2hBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6InJvbm5ha3JpdCIsImZhbWlseV9uYW1lIjoiY2hlaW52aWNoYWkiLCJpYXQiOjE3NjA5NjA5MTgsImV4cCI6MTc2MDk2NDUxOH0.Jyg9aXcfR3HB635wk16usmNPVQt-QgueyvVieqjFV4T3FjacI0gIOuaskNFCF9C_gZM195pEU1p_OMzyc1JbIVoad92Jnm3xq3y00ZJ9FmnKzFMn2UNGWFIt5QXA3w6dTOcj8qjA_Rr6mnGTQnelg02RGK3n8hUSKhuHnPy56K_WiwOaDzfWk2zmGZA18ZaJOlFc8aHHfHGBzPSMiLTMmt8lVTpajtCbORR62fQwoHy1-vBoAUJlZmk2bKTaCDgiH6h6n5rNY4CH4RoaisZ3oSovQwGG-9IHbCl2Y8vYY8O0hEj5aC8DNnEClb7c46gJVpvtl32ewgvOK1tVPHKd6Q	2025-10-20 12:48:37.27	\N	openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile	\N	2025-10-20 11:48:38.561	2025-10-20 11:48:38.561
yqa7FYYm6R6LPUMYmBCHBrSi69jBllay	102262455640766488240	google	uCdfKV1l5UvnFmg1ePvmIXjk8fSFaqCd	ya29.a0AQQ_BDS1qj0Xa6-eamzIfSpYlIZ9jaYij5C2RBFVRT97oxAtfj-jCXLJF5gfI-QaCKmFtIR6kRbommw_6SxFEgYVakq_WZWgLBE3MV8zERTjU6cn9IyfuHftVXgGiznrvIT-5pIIole2DLgICmi54FzkPZkTUoWKH0j3GyMaWC8Qd91Pc2g5k_gjBetgummfHcejWR8aCgYKAQASARUSFQHGX2MidOyAQiZ6qDPD-c4L6wjPzA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImZiOWY5MzcxZDU3NTVmM2UzODNhNDBhYjNhMTcyY2Q4YmFjYTUxN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDIyNjI0NTU2NDA3NjY0ODgyNDAiLCJlbWFpbCI6ImV4cGVydDhzb2x1dGlvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlZ5ZmpsOEM2V3hVc0xoRDQ4SDM2dVEiLCJuYW1lIjoiZXhwZXJ0OHNvbHV0aW9uIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tGTXZfcGhXR1pyYlRSLW1UWUVXeFNMNFoycHhhN1ExaWRZbmQ4Z0huTXJkVjNXQT1zOTYtYyIsImdpdmVuX25hbWUiOiJleHBlcnQ4c29sdXRpb24iLCJpYXQiOjE3NjA5ODc4ODcsImV4cCI6MTc2MDk5MTQ4N30.Z5_AjCAlovTkZHYq9rhWwQm7-bGJZfcN97I-_CXRBNRN5mbyrpVY0urz3PwVkMZBqreAqE10DuEMRCzDZdnu793QNSqThcdGtDaGdFRuufikh_SlJ6-JkR6oHKkRx2akfaRtlNXBtzegr5_ZxjUclbYcxuuOQ4_49gmniW5vAlbXUBym3NUsk62OcJp2okKveB00B3alxTpLnRX07CMycTcOgms28erlYLP40eNxle15fm9TBpZ3lJwtFT659G5myHjMfvbsmL9GnM_TWsocuHy6X2fWwkWoFNRbZkvvQiZ5_aQYee1nzprcyrnvbp3eI4Q1i6AqMIVvyiGvtv6QTg	2025-10-20 20:18:06.222	\N	https://www.googleapis.com/auth/userinfo.email,openid,https://www.googleapis.com/auth/userinfo.profile	\N	2025-10-20 19:18:08.546	2025-10-20 19:18:08.546
iDPi4S4IOImGCxTtkIrmtpxxTENjW1Dz	113210007557178594494	google	DkC6JUXnfpmTddUNpPsgp1fPALT5GaWW	ya29.a0AQQ_BDQTdWkUTKoJwPNHWBFGxzCqgYExWzdOopVx53UfodkGyM_lbMduGgNqsEAEfrHfESbEKw5SeRtFOsrt5uqTs3sI92eY6MrcR6-aXb1gPx_qhMitAnGa9m-dvCbD4L1sil4wR2zYGOQwA56wra4TemQpZJJypptzwq2lcsBA2YD1pXSkibMaec9r0Lknz_vJ7Q0aCgYKATYSAQ8SFQHGX2MixD2Yl57FqRg7MIphFpeZCQ0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4NDg5MjEyMmUyOTM5ZmQxZjMxMzc1YjJiMzYzZWM4MTU3MjNiYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTMyMTAwMDc1NTcxNzg1OTQ0OTQiLCJlbWFpbCI6InByZGNqMjRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJzd3FXVnczYlZZa1JZVkY4azdrZ1l3IiwibmFtZSI6IuC4nuC4tOC4oeC4pOC4lOC4tSDguIrguYjguLLguIfguIjguLHguIHguKMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTExtRWZJc1E4VUZfWHBXMXFmUk1TblliQVpkdWRvdXZWUDd5TV9kNURNN3RqWlFRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IuC4nuC4tOC4oeC4pOC4lOC4tSIsImZhbWlseV9uYW1lIjoi4LiK4LmI4Liy4LiH4LiI4Lix4LiB4LijIiwiaWF0IjoxNzYxMjk3ODkyLCJleHAiOjE3NjEzMDE0OTJ9.2EZa2ch2vkrwldM_efF7-MsFWcbtyqemuhKduL-bUisoaa4fygVhI1a6b9vj1TS0gNIHtlkgETx3r2Mdh8e5eyxdtt4pcP4ZHXO4ivflX1pwmjcSsqQHdNoAfaYtxkC0pY48LqZCs4Y0qEli68pxkRUbDFXSz8kyEzrVRpXt2gSRTgiXzm6ySbbV1oSve7JTiQBzXCM__PWV0pg8tAsqe0jCEIBk6rqelvpTurcxUowkRV5bXpKRfxh3evIGnJoCraAlin6jgapjIbSUdua9qiu0z96afLm1AQDpaOfp_mMNiUqxrb649n5j4V_GYF8dt1QQ3Jg_RxV4kq62TjNp2Q	2025-10-24 10:24:48.799	\N	https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid	\N	2025-10-24 09:21:57.512	2025-10-24 09:24:53.67
K6uZS2ytUfwn1S2ovX4qYQqPwn4psBDM	103796160215024845027	google	nXq0KBD6BKMhkgcl3pWwUXmv8942a4vS	ya29.a0ATi6K2v83mTkqwdZQL1ynHSoRt73gPAZxQh_9Wzo12nU6P3FqbcF0T2sbgaQ-pkXh8IewQTFa6Vt7QcYsmFhGsnUVyjreRVNNetJveXGO_ypXVfO3R5_g6Rlpx2K8ZvOn5jpjmJWYrWhNjUE7FzfuWnli_Nv7ItftjtknfI5WF1eS5dB0g0pJWe5PERMmy4TEYF8w1YaCgYKAZ0SARQSFQHGX2Mi1D0J3HR_ankbYHCsH7AvqA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4NDg5MjEyMmUyOTM5ZmQxZjMxMzc1YjJiMzYzZWM4MTU3MjNiYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM3OTYxNjAyMTUwMjQ4NDUwMjciLCJlbWFpbCI6ImhhdHNhY3NvdHBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJIdEZUcjNmNFlmMERhZTJFRDFCWm1BIiwibmFtZSI6IkhBVFNBQ1NPVCBQSVVCTklNIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0x2ZTJ2TDV6UmNxZ2JrYzdlNGltYmNlYVVNUWR0Z3ZLbm1Dc19RNHU5SkYyTkdyNXppPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkhBVFNBQ1NPVCIsImZhbWlseV9uYW1lIjoiUElVQk5JTSIsImlhdCI6MTc2MTMwMDY0OCwiZXhwIjoxNzYxMzA0MjQ4fQ.ajVuRehDFgAA8XFZHkXfKWPsK0du_t9RG32wb0uOKfg05SnxQY4PC997g_Dwcx0i9vY7V4795S8bxedbfAsE08AWtnlSyczL9pyDr4ChRaNcSUJG0o5nb5XgEi_bUqXlESknhI8jyrA1WkJnOuslJzn8nVIs7iHwTnb5fQCeKGo-nnXt4r22wTz-HM6NRqRWHCHxPaIFYEX0LfpfTJ_OdWckxzvU24LRXDqX2c0H4UcVrlyMY7QXw_7id7adL7ptsPKA053_i6JBPq-zJOzoO2A7RdmBLZHrpmkXuVLvOHgy4f3VmiGuAwKoazjAQiJHQzJCxWKPahn_cKVHRCWz7w	2025-10-24 11:10:47.696	\N	openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile	\N	2025-10-24 10:10:50.215	2025-10-24 10:10:50.215
p1Hr4xJRvNVOYI5OdKjOU7Ke0hit1lfI	109390312532836544042	google	qH5c3XuAAd7NaT3U2bwxCotjchA9gaor	ya29.a0ATi6K2sEqBlAKzNFunrqzTSq_Ip0qMMUKAxBTkg5uGp3-ubgz5xGsCzca0Aixuz_BxNg7xP1i5S2M2jaK3Xk9AcK01nCslXAJf_CP9Ao36qovcZExDWjtt0DEc1CR3LcifxVU8ppjFPv6n7W5v7zuZT3nQmQw7OhbVQ_Y_syliBF7iIbV6CRFffivQnVfj0TGOHLcuEaCgYKAf8SARUSFQHGX2MiXRTFDqHjjx_MuuW6emmiIQ0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4NDg5MjEyMmUyOTM5ZmQxZjMxMzc1YjJiMzYzZWM4MTU3MjNiYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDkzOTAzMTI1MzI4MzY1NDQwNDIiLCJlbWFpbCI6InBvcHBlZXpuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiM3d4VWZ0TExoZzFGQ3U2T1pzc05UQSIsIm5hbWUiOiJQdXRoYXQgYnViaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJMm1JZXRxWWw3Y2d6Vlp4cUFLSXp6NHpkdGo3TDZ3TmFjb0xlU2w2OUEzUHgtUDVnMT1zOTYtYyIsImdpdmVuX25hbWUiOiJQdXRoYXQiLCJmYW1pbHlfbmFtZSI6ImJ1YmkiLCJpYXQiOjE3NjEzMDI2NzUsImV4cCI6MTc2MTMwNjI3NX0.1Zhprr87dhdU57GTcutOFc_KiI23rM1igzhVJb-KrCzOpKLKy7ABP6BlsXnd91GzxmS8JMgsVt-TShepbYIxfAeYuEU1Q9jfv0aUlGlUznl4HXe0IP8R5BxemBTnUbemKssDkrpB6bXM3wPlCfdUaPR0R4N080oUFS473QHjUWwaxwnzXgyF7R6N96JrGwU8Hz5u0iO66BRPJ90_GSo7yduf8z3gujmhpkoYxBkjinPTS-M8EfMdCTBymBdSdqdWIHoGQUI0t_iUVesQlw1HJnm7XZJoEYDdCepbRst5ZfhbV8GbccLsH6OM_H7DhEeRGY4zRqg4g55FZnN0SC7p4Q	2025-10-24 11:44:34.978	\N	https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid	\N	2025-10-24 10:44:37.265	2025-10-24 10:44:37.265
PsuwBGQbLVTxgT64OptOravHeb8Q5nLd	DXt4LVJradCTh8GHX3ZS2Nz80wxpGmbF	credential	DXt4LVJradCTh8GHX3ZS2Nz80wxpGmbF	\N	\N	\N	\N	\N	\N	1067e1cf4fe5ccf185f67313bdd0af92:eb4ba1d0e1c4ddfd8444bab204bb93dd278648d9e27a66facf9abd3e68c81c98d02d83e8243eb16739f6d2a6df0d421fa8ce20ebd3aba635766da2b2c8bcb0ad	2025-10-24 16:14:28.313	2025-10-24 16:14:28.313
NeaQvZC1wnu0KfSiT7AatFspQVi3QAuq	ucdAcyFpkzr9fuTjhd0wjygtaHdnF7M0	credential	ucdAcyFpkzr9fuTjhd0wjygtaHdnF7M0	\N	\N	\N	\N	\N	\N	af6838de74336543b8698a913daec999:8f29c407ed8a584f35699bcdedf3e2750b8ac7d2cea48ba845152ac60079c87eb56c86673bbf4a5412783f7420dfd4eff5d91d155782b89d22a8b4a9a1b520c3	2025-10-24 16:32:40.008	2025-10-24 16:32:40.008
xukENcvfwCPSUjDx1iSnq2nGdroJQah9	103239213094926695827	google	bmuURX7ZswSETG3oV3Eczu7Dv9XOcSTt	ya29.a0ATi6K2t6e6PfI_rgXCqEYa4t1wAqm8EqwJx0Qro_2isIK9jn2iWWRP93Vqnk6xfmwddTPIkFCKuFhSMuonggrTWaftodV_SZ1AgzbAZeqspQjP3nVBxGcm0CvysCcMD-u4agElBvgftmmY3XxvBRRMfLMnES9RBPpR-pWArsdITZa4gbDRMFT-HOi63eQGfpUGobARwaCgYKAXoSARISFQHGX2Mi37B9jMhwL6RzVEBQbXK6qA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4NDg5MjEyMmUyOTM5ZmQxZjMxMzc1YjJiMzYzZWM4MTU3MjNiYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMyMzkyMTMwOTQ5MjY2OTU4MjciLCJlbWFpbCI6InR5dHQ0NjUzN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IllSRGRuN3NkQWdBd041SHFJNGFWc0EiLCJuYW1lIjoiVHQgVHkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSU1xd0RteHlMLXVqa01jSEtwMGtqeUU0ZVVPM2hEMUFCUUNtNnE4TlFGQjk3bUZRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlR0IiwiZmFtaWx5X25hbWUiOiJUeSIsImlhdCI6MTc2MTc0NjA1MiwiZXhwIjoxNzYxNzQ5NjUyfQ.QHkFKhPtESir3WuzTliGf9-AIy-FnlhwnnLwSYXVP3kgQInPy-nHj1yf52lbu3cACvXuC-K1eLezyvONIVhn04use9PnRqbGcdIKcTLDgVQc69G_Zu1-NI_0cQAHRj4Q8uSHWxPWf2cEYjWz4ncpiWa1K2F3tNPzl7R0NK60TPx9fGJV5Mot1x7Gugj5zbSRCtWg0utscbCfOfABCj-OndJDGzD220Wi_uUU2gU8iUoHh_Xj2HKAk3xiCtkWzdgw4YTxPF9UdFeZpdP5FfKM-lC5s8XMRfBV97xjyRLNDhbHQfT83XTw_YJCgWGy2s781lGRpJdhlCVe9FTMcJDyIQ	2025-10-29 14:54:11.266	\N	https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid	\N	2025-10-29 13:54:13.584	2025-10-29 13:54:13.584
yeHIiGkbCSvhKNUP3UK9YcMkav62rh0O	cXDYy0ikduydWOeiSmLB6SV2HIIFMqes	credential	cXDYy0ikduydWOeiSmLB6SV2HIIFMqes	\N	\N	\N	\N	\N	\N	d2207a619b1c1cbae1db9f26a9b37ba8:cc29e8ba178e11992569fa05aa840bc0e2ec3e7a744ea22dc0638c74a0ef59ebc457ff11b5b61f640d3300bca45362c9f78e3c14699b50b8d0961a239a042c1d	2025-10-25 09:00:56.139	2025-10-25 09:00:56.139
57xSUmKU6KYsVqc7bBhee8fserrLX9sb	107774105207648794255	google	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	ya29.A0ATi6K2s7S4t1-1T4gRhaUhJ5hz9wLxxEtGxmRp4JtVw8ZK_Mqjgm7mYk2Rcfv2e0KulnZl_OLITAjqtKC4Zg4zOMLFzrE4saNuWJ3NnkmOMH9dAYgZ7rCcBEYsJKsu5cLhl66gYdASs2Gv_Q3NJT1ZLyz6fn8mGCrmjfaWwCEPKL0wzWHAGyy4CQ19JeXbS_4ZB3iHXlt6e-nhc-WfQs7x4Yf3-EHNjBTY4lxCPcuprrPj_2bCZ0wRwVgRweWZED-g6LesnqrzxldbeQkfVvGIAYOBwaCgYKAaoSARQSFQHGX2MiwbJ38RqlN86ASuh0OmRLwA0290	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1NzMzYmJiZDgxOGFhNWRiMTk1MTk5Y2Q1NjhlNWQ2ODUxMzJkM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDc3NzQxMDUyMDc2NDg3OTQyNTUiLCJlbWFpbCI6InBpY2hheWFkYTA0MDY0MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkJSNDhqcEFHcDJtV1R2b2xqT2FJRXciLCJuYW1lIjoi4Lie4Li04LiK4LiN4LiU4LiyIOC4nuC4seC4meC4l-C4siIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMSHdYdC1HdnUzSzc4MndNbmVaUThuYzZ2M19hTUJxU3BVLWNGTjZneHBGeVNXdnc9czk2LWMiLCJnaXZlbl9uYW1lIjoi4Lie4Li04LiK4LiN4LiU4LiyIiwiZmFtaWx5X25hbWUiOiLguJ7guLHguJnguJfguLIiLCJpYXQiOjE3NjM1NTM2ODYsImV4cCI6MTc2MzU1NzI4Nn0.dR6brbF5Y0gl554b7LK_qwAGV20IUQdCd5VUPbugqlJ2JORDXwI22Ggvtv0JxtYB8LA8ze46Pgmfo0FXN2RylT955P-TWBuZM4v0WmLqyup4g5_XEKhXjlZ2jQBFnAwyRHW896P9GpoUETi_EJtlP_VETcC7mWVUgtxhr8UM7TNve4ZV5-MqZVcFqsPMT_gnpu0tQGGTldw1R2yx-QLrxO8axw8RMvLRv82vzePS6_mBk7vdtNjD9CRRzfkWlRBn5k_HvSDtiZJe8VY7aiF3Q8wf0LTDzS2nUrRuV01WUQJFCu2kmO9rSfZ0a-HPSu4prQgI0bdTno3U_NESRlHp5g	2025-11-19 13:01:22.18	\N	https://www.googleapis.com/auth/userinfo.email,openid,https://www.googleapis.com/auth/userinfo.profile	\N	2025-10-24 14:49:50.749	2025-11-19 12:01:27.062
yQmFRmhTBVDPjrGqFNaaAkCcQQvzza5k	118024075527107658912	google	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv	ya29.A0ATi6K2tOMBQSIU4UmwkcDopkMy7LJuXB5eNZOWnuViQgc_tcRMwBmXKufKwHF9xSUM8shC3mOz_cVecsC5ajjXL8RtBTLWei2YR8nJdYWU2o2M3lx1xUM6c4WMezgehIBXwD1kZMPwyG_vj9UsEm02m9vzcxhaY5Ivt0B0duW7pNUXP6U2s7bmBya_8uXxm7K3tC6ZRarLggikVQVqcmhxXOkM9nt3u-gN3rwChjeNbkRqB7BOMdDiO8efmcVOZlhLttn_viW_-k0kd2yE0QflmwJXufrQaCgYKAQYSARISFQHGX2MizDiHauvCH6la-bXySYGbQg0293	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4NDg5MjEyMmUyOTM5ZmQxZjMxMzc1YjJiMzYzZWM4MTU3MjNiYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgwMjQwNzU1MjcxMDc2NTg5MTIiLCJlbWFpbCI6IjU5c3VwZXJyaWNoc29sQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiT0ROY0tpaHJ2Z0tOSVJqWTJCVWY5USIsIm5hbWUiOiJyb25uYWtyaXQgY2hlaW52aWNoYWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTHBzUkluZ0ZvaXV4VWFyN01hczlLU04tek5fM3ZsNnNTYmtvZ0ctcV9ubkx2WkFnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6InJvbm5ha3JpdCIsImZhbWlseV9uYW1lIjoiY2hlaW52aWNoYWkiLCJpYXQiOjE3NjE5MDg4OTIsImV4cCI6MTc2MTkxMjQ5Mn0.B-8-laGhwtWMJo6UIAvD7lz1gJ9khpO4IQ2cg8WLyu1x5CgLh_opPsEL0o_05gKDLLgh441VbhB9afQKWICZEmo3wz2u54sqZHyBGAilXxgeNqARvNA2b8rRRSd2bb2Xai1h2HDAmdFqJZ1Yd4sJWGJqgSdByBM4Xz4xZ5XhcdUIM_oFZlGfVefuqApjvTuqKkIRpAs89zHJpKp1RKuIJcmHG6WvJFG620hgs4XR2KNIMkgc3GKULs8uJFymVw8MdGg65T93T-u2Xq5apc11cp4wyKEKff1fRhA2lEthSR2dlou47xd21q8Ffrt0EHSgxxEHS7l_KRGsGxr7RxGmrg	2025-10-31 12:08:10.685	\N	https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid	\N	2025-10-06 11:03:57.976	2025-10-31 11:08:13.01
UlACpkCeqyixYl5MtvhXzf8XEQdHZMne	107130818036813320426	google	l5i3W5iRJBwGO002ceSUGQJBWoFEsBwY	ya29.a0ATi6K2urvPZuAK7qfQwpaM3BFn2okXahxyQywWwuTpaIDoh0CXolxEmyfuWwdGEFKsa4k5DIl4BZOV_LIZ0mzpal2D7SH5IBuDGB1DkhIGE3Ffik5c_xDNUCLpitqlHmHz5VhSvGmlU8NKOPqpjxZz-DsgWEX1hgLWjF7eM-C6tOWgwhLr4EfGT0yTPzrM7ajc5lZkgaCgYKARQSARISFQHGX2Mih2QAzr5r_pY3awFaUmM0nA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImI1ZTQ0MGFlOTQxZTk5ODFlZTJmYTEzNzZkNDJjNDZkNzMxZGVlM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDcxMzA4MTgwMzY4MTMzMjA0MjYiLCJlbWFpbCI6InFxc21vb25AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJTcTB5Z1hvWHhJV0UweURSTC1GVWJBIiwibmFtZSI6IuC5gOC4m-C5h-C4meC4q-C4ueC4q-C4meC4p-C4gSDguIrguK3guJrguYDguIHguKHguKrguYzguYDguKXguYjguJnguYDguKXguKIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSUI0cXNkT1VBcGdUQ21JYmctSXNYZ1BnV3RpcVdrNWt2M2pXaDNVZ2IwUXczdDQ3RDU9czk2LWMiLCJnaXZlbl9uYW1lIjoi4LmA4Lib4LmH4LiZ4Lir4Li54Lir4LiZ4Lin4LiBIiwiZmFtaWx5X25hbWUiOiLguIrguK3guJrguYDguIHguKHguKrguYzguYDguKXguYjguJnguYDguKXguKIiLCJpYXQiOjE3NjIzMzAxMTQsImV4cCI6MTc2MjMzMzcxNH0.GthmcJwd-w2N8U5ZREfGi6WQEI7sSJwtr-ecSLgAWwCg1rHlPhBewHYeN3D0m41t2AVKcuzvwyt1Ap6C9Y1EPgdUiIhPTqB7BZwi5-7nbllf1ZFDcUWy4pS_EkSpvlVFkIICd9naZUjOCvSg_UNvYhNwZAtvVqGOqkM2caalBK0JhYjIracU-N4Linb_1JawRzCBDVChH8UAUz2D66-nB3DqV53KyWN1zFlMeti4Cptq36jWaza3rFU98h41fsuvSDdc8LT9OuL6bEuo1FUKtP1Gj__SjcbbDxGs3uY99BVPcE3SP93VAE7eA66y5Xk2ETTMr4vD1MUyOxkGDlaskA	2025-11-05 09:08:33.266	\N	openid,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email	\N	2025-11-05 08:08:35.614	2025-11-05 08:08:35.614
ObTchpyaKwzjaYhAKtgXzK92Z6xAuc2q	106805959853395027663	google	o1JiI5J8Qqs2TGyPVYlcra86zuYTzawp	ya29.a0ATi6K2vJfzHm-Tgr8LW7zPdKd9AZl34DMZJgwVldAy52cqHJqAh2FxcKEzfaRqS4nEbZuCPZ_8CrQBL2owKPM--yVsunHYFrjnnQzB_AomiLlmt8zCaZpCv8ZAW8XgUxLkFrdydfQCRe-vIYkmxsZ6UpDl302U-C1s1SYpK4IO6fVzPhCLhC0Yxbs071458PciTB2EAaCgYKAR4SARISFQHGX2MiuQ1wLkJcAre-xcUMakGoqA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImI1ZTQ0MGFlOTQxZTk5ODFlZTJmYTEzNzZkNDJjNDZkNzMxZGVlM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDY4MDU5NTk4NTMzOTUwMjc2NjMiLCJlbWFpbCI6InRoZWtpZHNkYW1uQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiX3p0NFBaeUR2WFZsTGdwbTNjeElwUSIsIm5hbWUiOiJUSEUgS0lEIERBTU4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSm8zSXRnX2hLcjNBWFpqZjZPaG4zR1Vqbl9Ud1BYQVNCU29CLVczSHZNLURvS3VSZjQ9czk2LWMiLCJnaXZlbl9uYW1lIjoiVEhFIEtJRCIsImZhbWlseV9uYW1lIjoiREFNTiIsImlhdCI6MTc2MjQyNzIxMSwiZXhwIjoxNzYyNDMwODExfQ.R5__qrmCnLzPWmBt8-7m-wdXpMA1U6EiDOmYTmV0_6TyzVQNlk5y8YulU156pWtLtlmKYpADdH88VXkmNIjc7f4PG68oPd40hjbEV_R7eQ-4au9y8ZWnusJOgY7q34Zz1AXPpsemTBlHXuf7_R419Y4AwQZJo62wCCZMXabzMsSXYNz0eHO-ddff1X8dLiZwRmQatgp4YVQRNsfYKhkVIL5nViomAQEJzzU3UXIJFMbF51-v7ruu7ZkTm79gJKNFWLN-E8NV4a4fb_M5wElZGIG-M6IHUFdvOVp9vZuXerkkG9U7AGc9wsf2utr9r8YQro8bTrqK4gIu29SVbfbp5A	2025-11-06 12:06:50.703	\N	https://www.googleapis.com/auth/userinfo.profile,openid,https://www.googleapis.com/auth/userinfo.email	\N	2025-11-06 11:06:53.002	2025-11-06 11:06:53.002
Q0gOWgaF5s9vKrqJtjKdDUr7O3rjMtGU	104945748361669933878	google	tC1i6hUHeZ1quzsGB9EsxxyGEi1I7LbP	ya29.a0ATi6K2u1Ri52FCQ05t1DWoDqW93XsVxZTSDN8Ep7pCEjlVSQ9YFpmlXigc0MzEv5XL4p2wnhGh8VQ0NiAgkF7SpJkcXoonF395jeOGk4SVb5Y7pMxT1veTBrL_OmJ5wOIdsk145DRprgbcR7iagh94sqhfTx8je91HQlN3QgMupJfFi6EJ39nfUBL0AXTqUHmSNVP14aCgYKAZASARcSFQHGX2MiIyXg3pzNCAEBorbVt5mDlA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6IjRmZWI0NGYwZjdhN2UyN2M3YzQwMzM3OWFmZjIwYWY1YzhjZjUyZGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQ5NDU3NDgzNjE2Njk5MzM4NzgiLCJlbWFpbCI6Imt3YW5qYWkxMjkwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoidEtNS1BpNERLTExIVnplRlduVXFfdyIsIm5hbWUiOiJLd2FuamFpIE1vbmtvbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS2ZBVUZERnBYODZnLXF1WTlLY3puZlZJUVFGNWVqS2x3amViVkR3bzEtZFZIYkhnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikt3YW5qYWkiLCJmYW1pbHlfbmFtZSI6Ik1vbmtvbmciLCJpYXQiOjE3NjI5NTQ4NzYsImV4cCI6MTc2Mjk1ODQ3Nn0.MmOYdFeNwPKeDWAcDn3AbqEVLUqR5YoBGvkf9MmS3xjx2QkCH8R7g4t78npJGd1fL_2N2mjd33B7-4foKesC87v_JGEvZPXGxrdkD_GG450DwBIuq2AWHOfxbMUMGm6Mcy_XLSqJOezhSlQLTQ52p6XMUYNpLYioPidpT3c1k7IiG91YoRnAR3zKqXxqj2bDFCLA6YyMwa_hnLa-OyzDV-fxLpf9oJRl4vXndNTUObX8Wc_G_OSaWywzFIYoWFs1nfsHodXx_vV6FOVpcue1PKC1STmeUZyEJ6NuESpMvhg-0RmyXHdgxd8R_AntQv2pvPHESqmTl5UDQxZonbOWRQ	2025-11-12 14:41:15.226	\N	https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid	\N	2025-11-12 13:41:17.513	2025-11-12 13:41:17.513
fH8NKo3ZQQVTo91gbDscYwQcnS1hNFDl	U4JFVaPgAVAw9YmwX5kwK7cdtdIhoB8m	credential	U4JFVaPgAVAw9YmwX5kwK7cdtdIhoB8m	\N	\N	\N	\N	\N	\N	8d16d35363f25085804e7a4a193591b1:f9e83fe0843f0bce45217497ad32d6254f8a57907d9148d3fef4180a62cfc5f7d223d08fcdfeffc4a378b97cace55dfb20716d4d6d5d90eab04e79cece332983	2025-11-15 15:01:29.129	2025-11-15 15:01:29.129
iB2SBHNyRtHld0wX8Du66EAIM9W5VEGA	103908806386357074901	google	DKRL5rZgbDkKoUiVuhOb1sJ8Id6T7GmD	ya29.a0ATi6K2tK7CZE9jxrVuHfN9szpN69uNO_c22PXZWhtvKBJdXxmUBOyP5fHej1RGlOJBaBoko7x4OmnoQhIIzdjdNZnc9-54IkjakdIV9B5bz4iP--pQadH_YYsuhTJ8zFlD2wyohKfQS-ws-Ptf9uEbfc1BrbRVM28MMf7WGJ-qTIY8yQn5tVvRMWpKtjUsKIGpNtxrAaCgYKAdQSARcSFQHGX2Mi9byTSklVIWp3ft-VEbCwEQ0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1NzMzYmJiZDgxOGFhNWRiMTk1MTk5Y2Q1NjhlNWQ2ODUxMzJkM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM5MDg4MDYzODYzNTcwNzQ5MDEiLCJlbWFpbCI6ImtodW5uYWluZ3R1bjEyMzQ1NkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImhGUFczRTBFTUU2TzNqSW9JVHY2Q0EiLCJuYW1lIjoiS2h1biBOYWluZyBUdW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSmRHUlhnT1dTREtMdDBwWEllU1YzNV9RR1dsOXpGOERmQzV2S010dkhUT1ZHeVJ3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IktodW4gTmFpbmciLCJmYW1pbHlfbmFtZSI6IlR1biIsImlhdCI6MTc2MzMwMzM1NiwiZXhwIjoxNzYzMzA2OTU2fQ.u3gNRexMvu0uCZPXg7Y2KWNDLl-YYKMZZuUgz-KraH4aU6R2iU42685TrSACVesCJ6e_fCwBg6xACpWaJ59sxE0qafZOjdeUKK2O2rTGNXLTuCMwy1J6khh1THRBzdm9YQW3YUb6eAS-gKwPnuVyDBUeoT8RX7yhTjwAGJeW5GvuDZVeLaUyHomljIcTrgU7yWd1vPEHX1ajyCSP2-GDsl2i3HKVAd42wiCEFLmJX0puChaZSyJylmVGRl49I6I450ZFjE9sJK_o4a1LIlZJec4-bpvGG1wx5jT9BKDKRGcoDqTRv2EHTcDGDvNDgKbHH43mxZijdlfXU-KF0Xd8Hw	2025-11-16 15:29:15.465	\N	https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid	\N	2025-11-16 14:29:17.789	2025-11-16 14:29:17.789
32osvEmiRgslPM55jrDEpgKRSsxVXZdU	101834775262399047850	google	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	ya29.a0ATi6K2uJEJsmZkpXLUE7_Uk6FwzSWwntWLO-AK1X2jbEyuOVgGaxXESRpMp5SimYHOUdwdt1iNLeQZR4h3nwsCq0Ylr1ydv3ldUMXP1CBv5RmpTr6SQUBhjJ2mdU1bk_NEKBjcXODUGmPic6zwtxHoE16OsgcLHEhAG8V8na0o_24weXr27lk0zK5JVM8OK3Ki4Ga9kaCgYKAZISARISFQHGX2Mir1Mzb983t5MAqZWwDBlgPA0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6IjRmZWI0NGYwZjdhN2UyN2M3YzQwMzM3OWFmZjIwYWY1YzhjZjUyZGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE4MzQ3NzUyNjIzOTkwNDc4NTAiLCJlbWFpbCI6Inphc3hjdmRldkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InJZU1JjYVhnUWVWQkZVMlFmRGQ0RGciLCJuYW1lIjoieGZsb3AiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVVHRzhsaVEyR3J0TVBuV0YwckU2cWZiX3dhQ2dWWkYzSXJQbEY4dENOVjZGS1d3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6InhmbG9wIiwiaWF0IjoxNzYzMzcxMDk0LCJleHAiOjE3NjMzNzQ2OTR9.paweqnaww96B7ZGHJbO4wa6fzmTJTLrPHYDUOww79ID2AihHvDHXkUNdDv0QqTnauqQRgIcaRj4szVsF4YKx8WhEKKdJ5RZcqeaxpEFi8S_xr0Pvsxh6PcozbrwrJ6rgso3fT3cPIYWaouIBVrfFpu2sUwW9lQimMenL104a5zL1qPNCWVHJmyfIcIj_F5JwZSU4xruT0V9GdhNVd_LFwyn1XBk3XiIl16zvxxY32UYqKvVfm1Gr5avWK8shYgAPGVrqO_0oYmQRqwh3LC8nsERXOf_NEXEOJhKwXmGuXQ-s5-abBNy7VgmfdKtR0lP61e_AFWsv3TNZppd8le3SNw	2025-11-17 10:17:41.668	\N	https://www.googleapis.com/auth/userinfo.profile,openid,https://www.googleapis.com/auth/userinfo.email	\N	2025-11-17 09:17:42.94	2025-11-17 09:17:42.94
11c6VR37qg5P8L0PRLq9Xw1u7uNUeblu	118038395277302675332	google	OHRGiRcDszNfSBeSISwv0IeWByHqExJo	ya29.a0ATi6K2t1K30pbouq9xCdIO91wkRoZgHpWiJpopwuFmhebmUh9wy_6Ju35rsFapLggeXhvOcCb-ofxwp9QzXu6DQA-ArhGA0fiPuJAakr73ghb-3RCr-Ew8vt-eewxXfpINvyjk5cOTvSeomRdcDUd8zFWczbCy2hoR7UxvaG5JNcBLIQKJZfXm15-0tJtUL5ekrab1saCgYKAbMSARQSFQHGX2MihD_7rh8h0W4vaqb08sElng0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1NzMzYmJiZDgxOGFhNWRiMTk1MTk5Y2Q1NjhlNWQ2ODUxMzJkM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgwMzgzOTUyNzczMDI2NzUzMzIiLCJlbWFpbCI6Im1tb29zczM1MDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJSb2xqN1EyVnpZMzB0SDU0TGxfWGRBIiwibmFtZSI6Imlr4LiZ4Lin4Lil4LiI4Lix4LiZ4LiX4Lij4LmMIGNobm5lbOC5guC4iOC4seC4meC4l-C4o-C5jCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMSFZ0S2pyYmJTcjVGYmE3aTNuWmZ4aDIwTFliZWdMT0dPbXg3VzdpS2Q0YWFzMjJ6Qj1zOTYtYyIsImdpdmVuX25hbWUiOiJpa-C4meC4p-C4peC4iOC4seC4meC4l-C4o-C5jCIsImZhbWlseV9uYW1lIjoiY2hubmVs4LmC4LiI4Lix4LiZ4LiX4Lij4LmMIiwiaWF0IjoxNzYzODU4OTMwLCJleHAiOjE3NjM4NjI1MzB9.B6sSqvzyqdMeC5c3dUYOzfKK3aDkYDGUwpNqtbvtaFKpc_GovkRLMhaByhfg0xJCG9JBrGC6Mz0IyVGYXsXy4pEKHxL62eI0wwZ7BHQkSVPFF7dUJ8kQ-B6GifNgvG7Ub8k5v0nfkgGe9r39smdO35J7zlPQ0TuwmtMOqI0mB14JWH4s_t182OFCRgU6ohuMDSvZxuCjpA8aki-cUFT7Xp24LIgQ3bCdNwWCxfOg6fhbf8psrnzpvctiEaZ3zk6i15GyBaNWN4VcjYvFfNNik7l86fTumTSxOnOQDcoslbLmSaN42BT1pKno8OjA12F4q3NvOB4k8Y3OPNtOhNXZWQ	2025-11-23 01:48:48.014	\N	https://www.googleapis.com/auth/userinfo.profile,openid,https://www.googleapis.com/auth/userinfo.email	\N	2025-11-23 00:48:51.353	2025-11-23 00:48:51.353
ee1T05dwJs812ZbS4G8KXc0Nd7av7ok0	101772054512862014380	google	M99B7kK5B66VgDKlphbFtYQqZMczZAKd	ya29.a0ATi6K2t7l98-jjjlzBvO8byY68x2NfKmSC4kNG01eItaGb7YnQ88frTiGnhccycFIR-QLkPTu7eNM60JPEZKeAMkTLBWmBfFx8xzQBLpDS582hwnOH0t8JjD1ZTSbq0M0JYT0h6Om7Ofs5f1f-N-sfYXg0VSiXAczuRCB3dTkRF5ZPrXb5Z5sXjBIEyqfL6Eg4T4-aEaCgYKAfYSARYSFQHGX2MiN5FDGJvIg5Z94lxwTYzNVw0206	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6IjkzYTkzNThjY2Y5OWYxYmIwNDBiYzYyMjFkNTQ5M2UxZmZkOGFkYTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE3NzIwNTQ1MTI4NjIwMTQzODAiLCJlbWFpbCI6ImNoYW5pa3JpYW5jaGllbnZpY2hhaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlB2REVJSmpfNXQ5YU5BSUV5Q1hXc3ciLCJuYW1lIjoiY2hhbmlrcmlhbiBjaGllbnZpY2hhaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLLWFpTl9OUnlzMF82aXpIaUV6dnQ0MnViOGZ5M0h6Wk1ZdlpPSVhYclZOWTdEPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImNoYW5pa3JpYW4iLCJmYW1pbHlfbmFtZSI6ImNoaWVudmljaGFpIiwiaWF0IjoxNzYzODk5ODQzLCJleHAiOjE3NjM5MDM0NDN9.CPFcwcCtTCbeiWNKhWeMxiSYkXYMLYynTP8w3rl6B5l_5hZxO4qOjE7x4Ujak-hLQKjFEhPdPJcgyz6y4aHY6-eUP7CB1LDk5zUkVTrsPYeUJ74fvyS3g4LeMej-GwHLrL7LrzicZBTecQJsiF1YU2_rAbJLLX4nHaUlpttTOgsqE2YWVOvTUs51gEb9LVx1DUOsqDBqHBRssIz6F-eXnqU1JZ-BL-iuO4DIvRHewAZHBXZi5Ys8aD4wEoMHPB-Ttrb0dS7UbkVn8f9tvIy_BTK60KFBVTmfbmiHhp9ZFtHxDHL1D0C_BBWLSkgXtzHnU2H3u9KCu852z_IbhJ921Q	2025-11-23 13:10:42.072	\N	https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,openid	\N	2025-11-23 12:10:44.36	2025-11-23 12:10:44.36
EvVhGzLiGGBV2lckxpwb9VU4SIVqOVIW	105414195141028956581	google	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	ya29.A0ATi6K2sDnuVx8AC4GaWrZOMrQOqxDtyiMl9tnfg3tVGzRGAG2HYZBYIhrm3Rx4xnN3xYb3DfkofyWF0LzVbzI5-6Dykejivdy3jL5GjzZ7_bqXF_eyifUEQUiH0RwU3nM2rfAbWQafmkJbMCMSavKXOQCcOJfKoeC_qbOAO7lJZslrubKkEEcapeXgrpN5VZ2V0d3P2MmbjwnuLUQQoVURPP_2vC7A6GZJlWX4fJZsn733tqIu-lN9yfIv5NJd31nhWqUkHkCO-aGzP9SpS1q417n9Mnyh77aCgYKAUYSARASFQHGX2Mi2hA_6vtguPsHcdk5lEphhw0295	\N	eyJhbGciOiJSUzI1NiIsImtpZCI6IjkzYTkzNThjY2Y5OWYxYmIwNDBiYzYyMjFkNTQ5M2UxZmZkOGFkYTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE0MzQ4NTY2MzctMWh1OTkyZGpnMm5kaDVkcXNndnA0YmF1N283cGZkYzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDU0MTQxOTUxNDEwMjg5NTY1ODEiLCJlbWFpbCI6InJvbm5ha3JpdGNoZWludmljaGFpQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoidTZqem11UllZazZGQnl1VjlTcEFaUSIsIm5hbWUiOiJyb25uYWtyaXQgY2hlaW52aWNoYWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVBSOWt0RE1CRmNsQkxlWFdrSnhtTGxkMXo2cU9mOFVfSU1pOEJISEU0TXlrSEl6Tjk9czk2LWMiLCJnaXZlbl9uYW1lIjoicm9ubmFrcml0IiwiZmFtaWx5X25hbWUiOiJjaGVpbnZpY2hhaSIsImlhdCI6MTc2MzkwMDQ1MywiZXhwIjoxNzYzOTA0MDUzfQ.aRMI0rZ-TwwXW0_K3s6ppRSnj2LisXd9Q3BEP1Zsoq8keqXZay2uH6sFqCSJ3YjWqnnPqhJrBnTi9jP5YFL6hlK29W7LenHbDMDGgzJbERA9-d3SgfkAWyLvdBVlLAc7sSc10GaQB-0CwVjzgsKI9SF8JnoDiXuSflGrdSVNcUBN_gZECmDpjnh_Lf3muQWZB8v2uX3pPniwbAlMPxWnHgjI3Uw6SDnCf51MyRvZbxeZVrEr1yqygoBq_2DZ86gSn11j4i_0kKhAmuuPTM0A2DYd7x1aEL6QOoBbYGAy54PzGUFoUPmBjvMyfgZhs9w7ec6fYVJN2wYH19xMFM9BhA	2025-11-23 13:20:50.263	\N	openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile	\N	2025-10-06 11:07:35.424	2025-11-23 12:20:53.916
\.


--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.article (id, title, description, keywords, slug, "coverImage", content, published, "authorId", "createdAt", "updatedAt") FROM stdin;
cmh4ppglj0000jy04qkm8hcrn	เติมเกม Rov ราคาถูก	กำลังมองหาบริการเติมเงิน ROV ราคาถูกที่รวดเร็วและปลอดภัยอยู่ใช่ไหม? velounity คือคำตอบสำหรับคุณ! เราให้บริการเติม Voucher ROV แบบอัตโนมัติ ได้คูปองภายใน 1-3 นาที พร้อมรองรับทุกแพลตฟอร์ม 	เติมเงิน ROV	เติมเกมrov	https://zcmnmpp6v3hjmfp6.public.blob.vercel-storage.com/articles/covers/1761301793534-logo.png	<h1>เติมเงิน ROV ราคาถูก รวดเร็ว ปลอดภัย 100% | velounity</h1>\n\n<p>กำลังมองหา<strong>บริการเติมเงิน ROV ราคาถูก</strong>ที่รวดเร็วและปลอดภัยอยู่ใช่ไหม? velounity คือคำตอบสำหรับคุณ! เราให้บริการ<strong>เติม Voucher ROV</strong>แบบอัตโนมัติ ได้คูปองภายใน 1-3 นาที พร้อมรองรับทุกแพลตฟอร์ม ทั้ง iOS, Android และ Windows</p>\n\n<h2>🎮 ทำไมต้องเติมเงิน ROV กับ velounity?</h2>\n\n<ul>\n\n<li><strong>ราคาถูกกว่าที่อื่น</strong> - เปรียบเทียบราคาแล้วคุ้มค่าที่สุด</li>\n\n<li><strong>รวดเร็วทันใจ</strong> - ระบบอัตโนมัติ รับคูปองภายใน 1-3 นาที</li>\n\n<li><strong>ปลอดภัย 100%</strong> - ไม่ต้องให้รหัสผ่าน ไม่มีความเสี่ยง</li>\n\n<li><strong>บริการตลอด 24 ชั่วโมง</strong> - เติมได้ทุกเวลาที่คุณต้องการ</li>\n\n<li><strong>รองรับทุกการชำระเงิน</strong> - QR Code, โอนเงิน, บัตรเครดิต</li>\n\n</ul>\n\n<h2>💎 ราคาเติมเงิน ROV อัพเดทล่าสุด</h2>\n\n<p>เราให้บริการ<strong>เติม Voucher ROV</strong>ในราคาพิเศษ ตรวจสอบราคาล่าสุดได้ที่หน้าเว็บไซต์ของเรา:</p>\n\n<ul>\n\n<li>Voucher ROV 60 คูปอง - ราคาเริ่มต้น ฿29</li>\n\n<li>Voucher ROV 300 คูปอง - ราคาเริ่มต้น ฿145</li>\n\n<li>Voucher ROV 600 คูปอง - ราคาเริ่มต้น ฿290</li>\n\n<li>Voucher ROV 1,500 คูปอง - ราคาเริ่มต้น ฿725</li>\n\n</ul>\n\n<p><em>*ราคาอาจมีการเปลี่ยนแปลงตามโปรโมชั่น</em></p>\n\n<h2>📱 วิธีเติมเงิน ROV ง่ายๆ แค่ 4 ขั้นตอน</h2>\n\n<ol>\n\n<li><strong>เลือกแพ็คเกจ</strong> - เลือกจำนวนคูปอง ROV ที่ต้องการ</li>\n\n<li><strong>กรอก User ID</strong> - ใส่ไอดีเกม ROV ของคุณ (หาได้จากในเกม)</li>\n\n<li><strong>ชำระเงิน</strong> - เลือกช่องทางการชำระเงินที่สะดวก</li>\n\n<li><strong>รับคูปอง</strong> - รับ Voucher Code ทาง SMS หรืออีเมล</li>\n\n</ol>\n\n<h2>🔍 วิธีหา User ID ROV</h2>\n\n<p>สำหรับผู้ที่ยังไม่รู้วิธีหา<strong>ไอดีเกม ROV</strong> สามารถทำตามขั้นตอนนี้:</p>\n\n<ol>\n\n<li>เปิดเกม Realm of Valor (ROV)</li>\n\n<li>คลิกที่รูปโปรไฟล์มุมซ้ายบน</li>\n\n<li>ดูตัวเลขด้านล่างชื่อผู้เล่น นั่นคือ User ID ของคุณ</li>\n\n<li>Copy ตัวเลขดังกล่าวมาใส่ในฟอร์มสั่งซื้อ</li>\n\n</ol>\n\n<p><strong>หมายเหตุ:</strong> ตรวจสอบ User ID ให้ถูกต้องก่อนสั่งซื้อ เพราะระบบจะส่งคูปองไปยัง ID ที่ระบุทันที</p>\n\n<h2>✨ คูปอง ROV ใช้ซื้ออะไรได้บ้าง?</h2>\n\n<p>เมื่อคุณ<strong>เติมเงิน ROV</strong>แล้ว คุณสามารถใช้คูปองซื้อสิ่งเหล่านี้ได้:</p>\n\n<ul>\n\n<li><strong>ฮีโร่ใหม่</strong> - ปลดล็อกตัวละครที่คุณชอบ</li>\n\n<li><strong>สกินสวยๆ</strong> - เปลี่ยนลุคฮีโร่ให้โดดเด่น</li>\n\n<li><strong>Draw Gacha</strong> - ลุ้นรับสกิน Limited Edition</li>\n\n<li><strong>Battle Pass</strong> - รับไอเทมและรางวัลพิเศษ</li>\n\n<li><strong>เปลี่ยนชื่อ</strong> - เปลี่ยนชื่อผู้เล่นใหม่</li>\n\n</ul>\n\n<h2>🛡️ การันตีความปลอดภัย</h2>\n\n<p>เราเข้าใจว่าความปลอดภัยเป็นสิ่งสำคัญ velounity รับประกัน:</p>\n\n<ul>\n\n<li>✅ ไม่ขอรหัสผ่านบัญชีเกม</li>\n\n<li>✅ Voucher Code แท้ 100% จากเกม</li>\n\n<li>✅ ระบบชำระเงินผ่านการรับรองมาตรฐาน</li>\n\n<li>✅ ข้อมูลลูกค้าเข้ารหัสและปลอดภัย</li>\n\n<li>✅ มีทีมงานดูแลตลอด 24 ชั่วโมง</li>\n\n</ul>\n\n<h2>❓ คำถามที่พบบ่อย (FAQ)</h2>\n\n<h3>เติมเงิน ROV ใช้เวลานานเท่าไหร่?</h3>\n\n<p>ระบบอัตโนมัติของเราส่งคูปองภายใน 1-3 นาทีหลังชำระเงิน ในกรณีที่มีปัญหา ทีมงานจะติดต่อกลับภายใน 15 นาที</p>\n\n<h3>ถ้าใส่ User ID ผิดทำยังไง?</h3>\n\n<p>กรุณาตรวจสอบ User ID ให้ดีก่อนสั่งซื้อ หากใส่ผิด ระบบจะส่งคูปองไปยัง ID ที่ระบุและไม่สามารถเปลี่ยนแปลงได้</p>\n\n<h3>รองรับการเติมทุกเซิร์ฟเวอร์ไหม?</h3>\n\n<p>รองรับทุกเซิร์ฟเวอร์ของเกม ROV ประเทศไทย ทั้ง iOS, Android และ Windows</p>\n\n<h3>มีโปรโมชั่นหรือส่วนลดไหม?</h3>\n\n<p>มีโปรโมชั่นพิเศษอัพเดททุกสัปดาห์ ติดตามได้ที่หน้าเว็บไซต์หรือ Facebook Fanpage ของเรา</p>\n\n<h2>🎁 โปรโมชั่นพิเศษ</h2>\n\n<p>สมัครสมาชิก velounity วันนี้ รับสิทธิพิเศษมากมาย:</p>\n\n<ul>\n\n<li>🎉 สมาชิกใหม่ รับส่วนลดทันที 5%</li>\n\n<li>🎉 เติมครบทุก 1,000 บาท รับคะแนนสะสม</li>\n\n<li>🎉 แนะนำเพื่อน รับเครดิตฟรี 50 บาท</li>\n\n</ul>\n\n<h2>📞 ติดต่อเรา</h2>\n\n<p>หากมีคำถามหรือต้องการความช่วยเหลือ ติดต่อได้ที่:</p>\n\n<ul>\n\n<li><strong>Line Official:</strong> @velounity</li>\n\n<li><strong>Facebook:</strong> velounity Official</li>\n\n<li><strong>Email:</strong> support@velounity.com</li>\n\n</ul>\n\n<p>ทีมงานพร้อมให้บริการตลอด 24 ชั่วโมง</p>\n\n<hr>\n\n<p><strong>สรุป:</strong> หากคุณกำลังมองหา<strong>บริการเติมเงิน ROV ที่ดีที่สุด</strong> velounity คือตัวเลือกที่ใช่ ด้วยราคาถูก ระบบรวดเร็ว และปลอดภัย พร้อมบริการลูกค้าคุณภาพ เริ่มเติมเงิน ROV กับเราวันนี้ และสนุกกับเกมโดยไม่ต้องกังวล!</p>\n\n<p><em>แท็ก: เติมเงิน ROV, เติม Voucher ROV, ซื้อคูปอง ROV, ROV ราคาถูก, เติมเกม ROV, Realm of Valor, เติม ROV ออนไลน์</em></p>	t	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-24 10:32:32.839	2025-10-25 09:27:10.812
\.


--
-- Data for Name: card; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.card (id, sort, name, icon, description, "isActive", "createdAt", "updatedAt") FROM stdin;
06e4784c-5311-4043-acb8-270063a4ed58	0	บัตรเงินสดทรูมันนี่	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน บัตรเงินสดทรูมันนี่	t	2025-11-19 09:37:45.025	2025-11-19 09:37:45.025
6789f67c-2dfc-4fc0-9f15-cb4201922732	0	Garena Card	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Garena Card	t	2025-11-19 09:37:46.154	2025-11-19 09:37:46.154
e8c7d1c3-065e-4bfa-8a0c-fa5f5b8730af	0	GeForce NOW (ประเทศไทย)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน GeForce NOW (ประเทศไทย)	t	2025-11-19 09:37:46.855	2025-11-19 09:37:46.855
781c4e1e-829e-4c71-ac69-a6bc629488c4	0	GeForce NOW (Singapore)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน GeForce NOW (Singapore)	t	2025-11-19 09:37:47.37	2025-11-19 09:37:47.37
41356e9d-1761-4ff6-9270-4e773e7745d3	0	Riot Prepaid Card	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Riot Prepaid Card	t	2025-11-19 09:37:48.264	2025-11-19 09:37:48.264
48e51573-7c74-4624-a9f8-66c6777395d3	0	Razer Gold	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Razer Gold	t	2025-11-19 09:37:49.15	2025-11-19 09:37:49.15
3f282253-8778-4982-b0d9-9cae98cedea6	0	Roblox Gift Card	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Roblox Gift Card	t	2025-11-19 09:37:50.131	2025-11-19 09:37:50.131
af181cb9-d62a-4cf8-853f-b05245cf15e7	0	Steam Wallet Code	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Steam Wallet Code	t	2025-11-19 09:37:50.649	2025-11-19 09:37:50.649
cdc28602-d657-470e-b56a-80cfd0eb143d	0	@CASH (Flash Sale)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน @CASH (Flash Sale)	t	2025-11-19 09:37:51.455	2025-11-19 09:37:51.455
ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f	0	@CASH	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน @CASH	t	2025-11-19 09:37:52.434	2025-11-19 09:37:52.434
6813ee3a-5c0a-42dc-aada-48e8bb8a796b	0	Starbucks e-Coupon	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Starbucks e-Coupon	t	2025-11-19 09:37:53.411	2025-11-19 09:37:53.411
550c8c43-179d-4c4a-ad66-a7a793c7c68f	0	PlayStation Store	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน PlayStation Store	t	2025-11-19 09:37:53.843	2025-11-19 09:37:53.843
9ddbd3a4-247d-4867-88ac-84a577dcefe2	0	Nintendo eShop Card	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Nintendo eShop Card	t	2025-11-19 09:37:54.27	2025-11-19 09:37:54.27
7b2d2c36-b321-4012-9479-d9349a4ccf7a	0	EX Cash	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน EX Cash	t	2025-11-19 09:37:54.697	2025-11-19 09:37:54.697
04c17bbf-a222-4e4a-b7e0-8e5821aab436	0	GameIndy	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน GameIndy	t	2025-11-19 09:37:55.594	2025-11-19 09:37:55.594
141ac68d-10ce-4be8-8955-312db714c4f1	0	LINE PREPAID CARD	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน LINE PREPAID CARD	t	2025-11-19 09:37:56.439	2025-11-19 09:37:56.439
793ec322-3a13-4255-b66d-26cad7de2c7e	0	Battle.net Gift Card	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	บัตรเติมเงิน Battle.net Gift Card	t	2025-11-19 09:37:57.053	2025-11-19 09:37:57.053
\.


--
-- Data for Name: card_option; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.card_option (id, sort, name, price, "priceVip", "priceAgent", cost, "gameCode", "packageCode", icon, "isActive", "createdAt", "updatedAt", "cardId") FROM stdin;
a042b602-0cdc-4f7b-90de-e01fd6a98426	0	50 บาท	50.00	50.00	50.00	50.00	TMN	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:45.477	2025-11-19 09:37:45.477	06e4784c-5311-4043-acb8-270063a4ed58
d6f78f63-3d4e-4783-a199-f83ac397ec45	0	90 บาท	90.00	90.00	90.00	90.00	TMN	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:45.616	2025-11-19 09:37:45.616	06e4784c-5311-4043-acb8-270063a4ed58
912b8630-9615-4044-8f78-4c7969483a12	0	150 บาท	150.00	150.00	150.00	150.00	TMN	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:45.709	2025-11-19 09:37:45.709	06e4784c-5311-4043-acb8-270063a4ed58
7849a961-ed3d-444f-ad22-5640d2302a20	0	300 บาท	300.00	300.00	300.00	300.00	TMN	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:45.802	2025-11-19 09:37:45.802	06e4784c-5311-4043-acb8-270063a4ed58
a73f50cf-227b-4bee-85ea-a204f39b6f74	0	500 บาท	500.00	500.00	500.00	500.00	TMN	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:45.893	2025-11-19 09:37:45.893	06e4784c-5311-4043-acb8-270063a4ed58
cadeba70-c32b-416f-be11-f528ef441ecd	0	1000 บาท	1000.00	1000.00	1000.00	1000.00	TMN	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:45.986	2025-11-19 09:37:45.986	06e4784c-5311-4043-acb8-270063a4ed58
84afc91a-cdfd-4ed4-a3e6-0716e0ed5c6b	0	20 บาท	20.00	20.00	20.00	19.30	GARENA	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:46.425	2025-11-19 09:37:46.425	6789f67c-2dfc-4fc0-9f15-cb4201922732
e5e12818-f72e-4510-a0b4-4103cef47cab	0	50 บาท	50.00	50.00	50.00	48.25	GARENA	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:46.517	2025-11-19 09:37:46.517	6789f67c-2dfc-4fc0-9f15-cb4201922732
7178a857-fe21-4b39-b938-d721bf4f707c	0	100 บาท	100.00	100.00	100.00	96.50	GARENA	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:46.609	2025-11-19 09:37:46.609	6789f67c-2dfc-4fc0-9f15-cb4201922732
3256e60f-df09-48f7-a9c1-f0691f70d55a	0	300 บาท	300.00	300.00	300.00	289.50	GARENA	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:46.701	2025-11-19 09:37:46.701	6789f67c-2dfc-4fc0-9f15-cb4201922732
0753a2c9-afbe-4568-9a27-e152f5bcb274	0	Performance Package 399 บาท- เปิดใช้งานรหัสที่ www.bro.game/true-gateway	399.00	399.00	399.00	399.00	GEFORCENOW	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:47.126	2025-11-19 09:37:47.126	e8c7d1c3-065e-4bfa-8a0c-fa5f5b8730af
6c994ea4-9caa-4931-891b-7d59c25b3f7d	0	Ultimate Package 649 บาท- เปิดใช้งานรหัสที่ www.bro.game/true-gateway	649.00	649.00	649.00	649.00	GEFORCENOW	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:47.217	2025-11-19 09:37:47.217	e8c7d1c3-065e-4bfa-8a0c-fa5f5b8730af
11df29bf-ddd1-493f-83ed-37b2056c3537	0	3-hour Pass 78 บาท- เปิดใช้งานรหัสที่ www.gamehubplus.com/redeem	78.00	78.00	78.00	78.00	GFNOW-SG	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:47.643	2025-11-19 09:37:47.643	781c4e1e-829e-4c71-ac69-a6bc629488c4
c5ee0c57-7673-42e5-855e-d703ee38d97f	0	6-hour Pass 104 บาท- เปิดใช้งานรหัสที่ www.gamehubplus.com/redeem	104.00	104.00	104.00	104.00	GFNOW-SG	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:47.742	2025-11-19 09:37:47.742	781c4e1e-829e-4c71-ac69-a6bc629488c4
fb4d5023-d108-4878-9d0e-9831a055c4d5	0	12-hour Pass 130 บาท- เปิดใช้งานรหัสที่ www.gamehubplus.com/redeem	130.00	130.00	130.00	130.00	GFNOW-SG	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:47.834	2025-11-19 09:37:47.834	781c4e1e-829e-4c71-ac69-a6bc629488c4
e6f4fe74-c0ee-4418-8e1f-d1e394e79fee	0	1-month Priority Lite 234 บาท- เปิดใช้งานรหัสที่ www.gamehubplus.com/redeem	234.00	234.00	234.00	234.00	GFNOW-SG	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:47.926	2025-11-19 09:37:47.926	781c4e1e-829e-4c71-ac69-a6bc629488c4
4e971ee2-4635-4999-aff4-79405987abe4	0	1-month Priority 338 บาท- เปิดใช้งานรหัสที่ www.gamehubplus.com/redeem	338.00	338.00	338.00	338.00	GFNOW-SG	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.018	2025-11-19 09:37:48.018	781c4e1e-829e-4c71-ac69-a6bc629488c4
42e070fd-c8b6-4851-8120-2b2677a004c7	0	1-month Priority Pro 442 บาท- เปิดใช้งานรหัสที่ www.gamehubplus.com/redeem	442.00	442.00	442.00	442.00	GFNOW-SG	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.111	2025-11-19 09:37:48.111	781c4e1e-829e-4c71-ac69-a6bc629488c4
ddc83f74-7abb-42c2-b850-7580f465e87d	0	139 บาท	139.00	139.00	139.00	139.00	RIOT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.534	2025-11-19 09:37:48.534	41356e9d-1761-4ff6-9270-4e773e7745d3
166eb543-6340-473c-b2de-6c64c42a9f6d	0	279 บาท	279.00	279.00	279.00	279.00	RIOT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.626	2025-11-19 09:37:48.626	41356e9d-1761-4ff6-9270-4e773e7745d3
3a4bf750-de6f-42a2-8040-653407eea56f	0	559 บาท	559.00	559.00	559.00	559.00	RIOT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.718	2025-11-19 09:37:48.718	41356e9d-1761-4ff6-9270-4e773e7745d3
46a44857-06b4-474e-808b-17fc3941f76c	0	979 บาท	979.00	979.00	979.00	979.00	RIOT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.81	2025-11-19 09:37:48.81	41356e9d-1761-4ff6-9270-4e773e7745d3
0b905def-c30e-4719-9851-8295e2e747aa	0	1,400 บาท	1400.00	1400.00	1400.00	1400.00	RIOT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.902	2025-11-19 09:37:48.902	41356e9d-1761-4ff6-9270-4e773e7745d3
9bb8a64c-9e02-4d44-9b1a-46dcdec62282	0	2,800 บาท	2800.00	2800.00	2800.00	2800.00	RIOT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:48.994	2025-11-19 09:37:48.994	41356e9d-1761-4ff6-9270-4e773e7745d3
878c4c95-2a90-403c-9a0d-701c84553ccc	0	50 บาท	50.00	50.00	50.00	50.00	MOL	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:49.421	2025-11-19 09:37:49.421	48e51573-7c74-4624-a9f8-66c6777395d3
b658ecfa-f8ad-4e05-ae14-96289238bcec	0	100 บาท	100.00	100.00	100.00	100.00	MOL	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:49.513	2025-11-19 09:37:49.513	48e51573-7c74-4624-a9f8-66c6777395d3
92265206-7f1f-4414-9862-ba082be333b6	0	300 บาท	300.00	300.00	300.00	300.00	MOL	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:49.604	2025-11-19 09:37:49.604	48e51573-7c74-4624-a9f8-66c6777395d3
b1121d5a-4994-4e00-a9e6-c0eefec17f83	0	500 บาท	500.00	500.00	500.00	500.00	MOL	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:49.696	2025-11-19 09:37:49.696	48e51573-7c74-4624-a9f8-66c6777395d3
a8962a53-1837-4ffd-b323-a335412c37a8	0	1000 บาท	1000.00	1000.00	1000.00	1000.00	MOL	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:49.789	2025-11-19 09:37:49.789	48e51573-7c74-4624-a9f8-66c6777395d3
711840f7-fe92-41ae-b94b-7c06658cf401	0	3500 บาท	3500.00	3500.00	3500.00	3500.00	MOL	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:49.884	2025-11-19 09:37:49.884	48e51573-7c74-4624-a9f8-66c6777395d3
622264b5-b9a6-41ff-aca4-b03ebff80b63	0	5000 บาท	5000.00	5000.00	5000.00	5000.00	MOL	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:49.976	2025-11-19 09:37:49.976	48e51573-7c74-4624-a9f8-66c6777395d3
0467f083-117f-4a55-ba8a-6bc53671de6c	0	300 บาท	300.00	300.00	300.00	300.00	ROBLOX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:50.402	2025-11-19 09:37:50.402	3f282253-8778-4982-b0d9-9cae98cedea6
84458600-913b-4dfa-82bd-0039b23cd380	0	750 บาท	750.00	750.00	750.00	750.00	ROBLOX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:50.496	2025-11-19 09:37:50.496	3f282253-8778-4982-b0d9-9cae98cedea6
c56c9b4f-9f0d-488a-884b-7abcacd97e11	0	50 บาท	50.00	50.00	50.00	50.00	STEAM	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:50.923	2025-11-19 09:37:50.923	af181cb9-d62a-4cf8-853f-b05245cf15e7
edbe4448-bf4c-479e-9d8e-0cd110f8b0e3	0	100 บาท	100.00	100.00	100.00	100.00	STEAM	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:51.018	2025-11-19 09:37:51.018	af181cb9-d62a-4cf8-853f-b05245cf15e7
20a30c70-dd65-4945-840b-ebb2eb1ae8fd	0	200 บาท	200.00	200.00	200.00	200.00	STEAM	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:51.111	2025-11-19 09:37:51.111	af181cb9-d62a-4cf8-853f-b05245cf15e7
948b4cae-8f7d-44c2-b9f3-a2632aeb73fe	0	350 บาท	350.00	350.00	350.00	350.00	STEAM	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:51.203	2025-11-19 09:37:51.203	af181cb9-d62a-4cf8-853f-b05245cf15e7
5ab65ceb-4bea-4b79-a28e-a7b4aa109530	0	1000 บาท	1000.00	1000.00	1000.00	1000.00	STEAM	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:51.295	2025-11-19 09:37:51.295	af181cb9-d62a-4cf8-853f-b05245cf15e7
06136be8-0081-4ad1-a830-9cf4fcbebeac	0	55 บาท	55.00	55.00	55.00	55.00	ASIASOFT-F	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:51.726	2025-11-19 09:37:51.726	cdc28602-d657-470e-b56a-80cfd0eb143d
b3a24113-3ceb-4bd8-9112-9f9a406b3981	0	89 บาท	89.00	89.00	89.00	89.00	ASIASOFT-F	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:51.818	2025-11-19 09:37:51.818	cdc28602-d657-470e-b56a-80cfd0eb143d
f81b2ed9-a042-43e5-85aa-bb28ec91c3d6	0	189 บาท	189.00	189.00	189.00	189.00	ASIASOFT-F	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:51.91	2025-11-19 09:37:51.91	cdc28602-d657-470e-b56a-80cfd0eb143d
e17ce35b-ed7c-4ac9-81e4-cce5cb2d1619	0	245 บาท	245.00	245.00	245.00	245.00	ASIASOFT-F	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.002	2025-11-19 09:37:52.002	cdc28602-d657-470e-b56a-80cfd0eb143d
b4e9f3c2-84e7-4014-b3be-4d094937b7c2	0	349 บาท	349.00	349.00	349.00	349.00	ASIASOFT-F	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.094	2025-11-19 09:37:52.094	cdc28602-d657-470e-b56a-80cfd0eb143d
98f13aa2-6b53-4d9c-8e16-180c43750547	0	450 บาท	450.00	450.00	450.00	450.00	ASIASOFT-F	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.187	2025-11-19 09:37:52.187	cdc28602-d657-470e-b56a-80cfd0eb143d
595eab99-d8ac-43a8-93cd-006125d09e5c	0	888 บาท	888.00	888.00	888.00	888.00	ASIASOFT-F	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.279	2025-11-19 09:37:52.279	cdc28602-d657-470e-b56a-80cfd0eb143d
e521a503-8b45-44d2-9614-26009fbf7454	0	55 บาท	55.00	55.00	55.00	55.00	ASIASOFT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.705	2025-11-19 09:37:52.705	ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f
2d08dd7e-3d04-46b7-b810-77682db27373	0	89 บาท	89.00	89.00	89.00	89.00	ASIASOFT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.797	2025-11-19 09:37:52.797	ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f
fa7cfccc-30cf-486e-ba1c-cb3851d59af6	0	189 บาท	189.00	189.00	189.00	189.00	ASIASOFT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.889	2025-11-19 09:37:52.889	ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f
3801010c-2e06-488a-87e3-ec77801a6915	0	245 บาท	245.00	245.00	245.00	245.00	ASIASOFT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:52.98	2025-11-19 09:37:52.98	ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f
8dd8b49d-7e06-423e-9976-c97123cd34ef	0	349 บาท	349.00	349.00	349.00	349.00	ASIASOFT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:53.072	2025-11-19 09:37:53.072	ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f
9280e8ce-c6b9-4b70-a7c7-10e444891a49	0	450 บาท	450.00	450.00	450.00	450.00	ASIASOFT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:53.164	2025-11-19 09:37:53.164	ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f
25dd0663-d4ab-43f8-bcaf-cbc351cc4d0c	0	888 บาท	888.00	888.00	888.00	888.00	ASIASOFT	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:53.256	2025-11-19 09:37:53.256	ea69bbff-e120-4e07-a1d4-3c7f72f7ef9f
153ff686-0eb9-4262-a679-e8c4f2c87a79	0	100 บาท- สามารถใช้สิทธิ์ได้ที่ร้านสตาร์บัคส์ทุกสาขาในประเทศไทยเท่านั้น- สามารถนำมาใช้ซ้ำได้จนกว่ายอดเงินในโค้ดจะหมดไป- ไม่สามารถทำการเปลี่ยนเป็นเงินสด หรือโอนยอดเงินไปสู่บัตรสตาร์บัคส์ได้- สามารถใช้ร่วมกับโปรโมชั่นส่งเสริมการขายของทางร้านได้- หากสินค้ามีมูลค่าสูงเกินยอดเงินในโค้ด ลูกค้าจะต้องชำระส่วนที่เหลือด้วยเงินสด หรือบัตรเครดิต หรือวิธีชำระเงินอื่นๆ	100.00	100.00	100.00	100.00	STARBUCKS	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:53.688	2025-11-19 09:37:53.688	6813ee3a-5c0a-42dc-aada-48e8bb8a796b
e9e405af-f393-4647-b066-b4987a7bf3f8	0	500 บาท	500.00	500.00	500.00	500.00	PSN	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:54.117	2025-11-19 09:37:54.117	550c8c43-179d-4c4a-ad66-a7a793c7c68f
cafbc877-4986-4960-9c61-1627341d8dbc	0	$10 US (ราคาจำหน่าย 330 บาท)	330.00	330.00	330.00	330.00	NINTENDO	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:54.541	2025-11-19 09:37:54.541	9ddbd3a4-247d-4867-88ac-84a577dcefe2
ae72480e-d29a-4b36-b593-49b5630c315e	0	50 บาท	50.00	50.00	50.00	50.00	EX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:54.975	2025-11-19 09:37:54.975	7b2d2c36-b321-4012-9479-d9349a4ccf7a
765bb0b0-f7a6-4101-bb78-bff9ecb493a6	0	90 บาท	90.00	90.00	90.00	90.00	EX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:55.066	2025-11-19 09:37:55.066	7b2d2c36-b321-4012-9479-d9349a4ccf7a
bac40d8f-362a-46a2-a437-80bd62195270	0	150 บาท	150.00	150.00	150.00	150.00	EX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:55.158	2025-11-19 09:37:55.158	7b2d2c36-b321-4012-9479-d9349a4ccf7a
5343b4b6-d7ef-47c2-9146-8940478b41e4	0	300 บาท	300.00	300.00	300.00	300.00	EX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:55.251	2025-11-19 09:37:55.251	7b2d2c36-b321-4012-9479-d9349a4ccf7a
34be2164-c647-4d8b-b75e-54b91386147b	0	500 บาท	500.00	500.00	500.00	500.00	EX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:55.342	2025-11-19 09:37:55.342	7b2d2c36-b321-4012-9479-d9349a4ccf7a
4cf970c9-6da2-4a0c-be50-c7868f61dbd3	0	1000 บาท	1000.00	1000.00	1000.00	1000.00	EX	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:55.434	2025-11-19 09:37:55.434	7b2d2c36-b321-4012-9479-d9349a4ccf7a
adeef772-d189-4aa9-9ca7-0ae5b142c61d	0	50 บาท	50.00	50.00	50.00	50.00	GAMEINDY	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:55.912	2025-11-19 09:37:55.912	04c17bbf-a222-4e4a-b7e0-8e5821aab436
6e7845be-9b4f-492f-8168-8ecac4e5d042	0	100 บาท	100.00	100.00	100.00	100.00	GAMEINDY	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:56.004	2025-11-19 09:37:56.004	04c17bbf-a222-4e4a-b7e0-8e5821aab436
8697d9e4-8fd6-42b4-9f58-0efd40570759	0	300 บาท	300.00	300.00	300.00	300.00	GAMEINDY	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:56.096	2025-11-19 09:37:56.096	04c17bbf-a222-4e4a-b7e0-8e5821aab436
eb7ceb8b-e4a9-433d-aeec-19e91c58a279	0	500 บาท	500.00	500.00	500.00	500.00	GAMEINDY	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:56.188	2025-11-19 09:37:56.188	04c17bbf-a222-4e4a-b7e0-8e5821aab436
e7ccbd71-c946-42b0-98a4-687d37c4dec8	0	1000 บาท	1000.00	1000.00	1000.00	1000.00	GAMEINDY	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:56.28	2025-11-19 09:37:56.28	04c17bbf-a222-4e4a-b7e0-8e5821aab436
d4d15e0d-9fcb-4949-863d-3a9f5787b108	0	100 บาท	100.00	100.00	100.00	100.00	LINE	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:56.71	2025-11-19 09:37:56.71	141ac68d-10ce-4be8-8955-312db714c4f1
c49c1475-d762-48d0-adf6-a8a44332ac92	0	300 บาท	300.00	300.00	300.00	300.00	LINE	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:56.807	2025-11-19 09:37:56.807	141ac68d-10ce-4be8-8955-312db714c4f1
bd2f8aba-054b-4cda-b818-bc5bfbb4571b	0	500 บาท	500.00	500.00	500.00	500.00	LINE	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:56.899	2025-11-19 09:37:56.899	141ac68d-10ce-4be8-8955-312db714c4f1
1cf04728-8ac2-43f9-9b67-13a283eb57c3	0	200 บาท	200.00	200.00	200.00	200.00	BNET	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:57.324	2025-11-19 09:37:57.324	793ec322-3a13-4255-b66d-26cad7de2c7e
11484436-ad01-40e9-aeed-2155bb5cf5f5	0	350 บาท	350.00	350.00	350.00	350.00	BNET	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:57.417	2025-11-19 09:37:57.417	793ec322-3a13-4255-b66d-26cad7de2c7e
131b8d55-97f3-47c2-9281-54d609946bfb	0	700 บาท	700.00	700.00	700.00	700.00	BNET	\N	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 09:37:57.509	2025-11-19 09:37:57.509	793ec322-3a13-4255-b66d-26cad7de2c7e
\.


--
-- Data for Name: featured_product; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.featured_product (id, "productId", "createdAt") FROM stdin;
cmgf32k1h0005iybe8x37b9d5	17	2025-10-06 12:04:38.262
cmgf32m7o0006iybek32o4li6	23	2025-10-06 12:04:41.076
cmgf32oq30008iybeditfd4k9	25	2025-10-06 12:04:44.331
cmgf32stf000biybextyc4ezg	31	2025-10-06 12:04:49.635
cmgf32teq000ciybe5atjp3nq	32	2025-10-06 12:04:50.403
cmgg0ybsy0001iycx0hplgb6a	110	2025-10-07 03:53:07.907
cmh4zc8mx0000l104ul74y8gp	202	2025-10-24 15:02:12.153
cmh50npn90000iyr87eld5kw5	127	2025-10-24 15:39:07.03
cmh511rp60000kz04o3t2a459	126	2025-10-24 15:50:02.874
cmh5122300001kz04jqw8zu9k	52	2025-10-24 15:50:16.332
cmh8rztx40001jr04nyv4ufo8	27	2025-10-27 06:47:40.601
cmh8rzwi60002jr04pemfijir	15	2025-10-27 06:47:43.951
cmh8s4xpd0000jy04ye35ffdq	14	2025-10-27 06:51:38.785
\.


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.game (id, sort, name, icon, description, "isActive", "createdAt", "updatedAt", "isPlayerId", "isServer", "playerFieldName") FROM stdin;
18fad89d-df1d-4cae-a723-c5c4a3fe3d2e	26	Honkai: Star Rail	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Honkai: Star Rail	t	2025-11-19 12:51:17.453	2025-11-22 15:28:34.834	t	t	Player ID
5795348b-5b69-447a-9294-c429af683862	19	Ragnarok M: Classic	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Ragnarok M: Classic	t	2025-11-19 12:51:09.339	2025-11-22 15:28:34.833	t	f	Player ID
a11e672b-a912-4b14-acbf-e6cb9794fa8e	25	Zenless Zone Zero	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Zenless Zone Zero	t	2025-11-19 12:51:16.268	2025-11-22 15:28:34.834	t	t	Player ID
ec2f21c7-1392-419b-9e67-1bf9a3bc1c31	11	Honor of Kings	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Honor of Kings	t	2025-11-19 12:51:00.207	2025-11-22 15:28:34.833	t	f	Player ID
e5640d93-6ef6-41d4-9499-d076b2703d48	21	AFK Journey	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม AFK Journey	t	2025-11-19 12:51:11.738	2025-11-22 15:28:34.833	t	f	Player ID
cbbf3a0b-b859-4163-a908-dc52a7bdc50c	17	Magic Chess: Go Go	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Magic Chess: Go Go	t	2025-11-19 12:51:07.109	2025-11-22 15:28:34.833	t	f	Player ID
e8365673-59d2-49b5-b573-6dfec1af65e6	32	Diablo IV	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Diablo IV	t	2025-11-19 12:51:43.762	2025-11-22 15:28:34.832	t	f	Player ID
dfd2eb34-346b-491b-b05e-0ed9ff07de7c	22	Metal Slug: Awakening	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Metal Slug: Awakening	t	2025-11-19 12:51:12.877	2025-11-22 15:28:34.833	t	f	Player ID
fb41ae1b-9909-4530-b7a6-674bf756c51d	5	Delta Force (Garena)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Delta Force (Garena)	t	2025-11-19 12:50:51.96	2025-11-22 15:28:34.833	t	f	Player ID
2fd884b4-33e3-412b-bc25-4deb754ca5d7	24	Genshin Impact	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Genshin Impact	t	2025-11-19 12:51:14.861	2025-11-22 15:28:34.834	t	t	Player ID
9e083cc1-4fd1-4376-ad9b-9af2be776c02	27	Dragon Nest M: Classic	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Dragon Nest M: Classic	t	2025-11-19 12:51:18.638	2025-11-22 15:28:34.834	t	f	Player ID
3c60946f-a92c-4e76-9e6e-acad8129f474	6	PUBG Mobile (Thai)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม PUBG Mobile (Thai)	t	2025-11-19 12:50:54.447	2025-11-22 15:28:34.833	t	f	Player ID
9e793feb-ba5f-4842-8dcf-54e4111a131a	23	Arena Breakout	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Arena Breakout	t	2025-11-19 12:51:13.937	2025-11-22 15:28:34.834	t	f	Player ID
65978655-fba0-4e2a-9df1-2701b217b421	7	PUBG Mobile (โปรโมชั่น UC STATION)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม PUBG Mobile (โปรโมชั่น UC STATION)	t	2025-11-19 12:50:55.498	2025-11-22 15:28:34.833	t	f	Player ID
58074e91-dca8-4d5f-ab17-0089410db139	29	Garena Undawn	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Garena Undawn	t	2025-11-19 12:51:38.723	2025-11-22 15:28:34.834	t	f	Player ID
ab37b300-d292-41ac-ae05-b7c9a8f03b0e	8	Seven Knights Re:BIRTH	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Seven Knights Re:BIRTH	t	2025-11-19 12:50:55.939	2025-11-22 15:28:34.834	t	f	Player ID
7dbb577d-1103-4840-9d57-d9751760be9f	28	MapleStory R: Evolution	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม MapleStory R: Evolution	t	2025-11-19 12:51:19.966	2025-11-22 15:28:34.834	t	t	Player ID
b7d4c274-dced-40c7-83dc-8f32186e9ef2	9	Bigo Live	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Bigo Live	t	2025-11-19 12:50:56.383	2025-11-22 15:28:34.833	t	f	Player ID
7b8c11c7-42ec-4c43-a165-b7f977e3ac2f	1	Free Fire	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Free Fire	t	2025-11-19 12:50:44.564	2025-11-22 15:28:34.832	t	f	Player ID
127d0036-b938-4019-b025-699a62f3fb24	12	Dunk City Dynasty	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Dunk City Dynasty	t	2025-11-19 12:51:01.44	2025-11-22 15:28:34.833	t	f	Player ID
3c3f4ac9-718f-44b8-b240-9ed406c591af	33	Teamfight Tactics Mobile	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Teamfight Tactics Mobile	t	2025-11-19 12:51:44.204	2025-11-22 15:28:34.832	t	f	Player ID
1f0b4198-a1d6-44d1-870a-d303d6789a3e	13	Marvel Rivals	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Marvel Rivals	t	2025-11-19 12:51:03.385	2025-11-22 15:28:34.833	t	f	Player ID
ea63faf5-ab09-42a2-9f5f-a151dc03dbeb	34	PUBG Mobile (Global)	https://softwarecrk.net/picture_upload/topup/displayPictureJ98L7_6NLV9.webp	เติมเกม PUBG Mobile (Global)	t	2025-11-19 12:50:53.554	2025-11-22 15:28:34.832	t	f	Player ID
94f44b85-f7fb-4243-a6a4-db9c3dfd36f8	14	Call Of Duty Mobile	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Call Of Duty Mobile	t	2025-11-19 12:51:04.265	2025-11-22 15:28:34.833	t	f	Player ID
49dd89a1-7107-46cd-adc5-6252047e8c8f	35	Mobile Legends: Bang Bang	https://zcmnmpp6v3hjmfp6.public.blob.vercel-storage.com/games/icons/1763819673090-displayPictureWTVLA_9VYUF.webp	เติมเกม Mobile Legends: Bang Bang	t	2025-11-19 12:50:47.374	2025-11-22 15:28:34.832	t	f	Player ID
00cd0fc8-fcd8-43bb-b8ce-6b8839d4c7ba	16	League of Legends	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม League of Legends	t	2025-11-19 12:51:06.207	2025-11-22 15:28:34.833	t	f	Player ID
3b8b2b36-fe45-40ec-8b06-0dc09e0026d1	4	Delta Force (Steam)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Delta Force (Steam)	t	2025-11-19 12:50:50.729	2025-11-22 15:28:34.833	t	f	Player ID
3aa46dfa-5808-456e-bf85-ab0ffea8330a	10	Racing Master	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Racing Master	t	2025-11-19 12:50:58.139	2025-11-22 15:28:34.833	t	f	Player ID
bce19e7a-e761-493c-93ba-092ef32537fc	18	HAIKYU!! FLY HIGH	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม HAIKYU!! FLY HIGH	t	2025-11-19 12:51:08.454	2025-11-22 15:28:34.833	t	f	Player ID
471260d5-d4a1-400f-8c6b-6d117a211c2a	20	Love and Deepspace	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Love and Deepspace	t	2025-11-19 12:51:10.578	2025-11-22 15:28:34.833	t	f	Player ID
9af470de-4f67-4067-b9da-f64beed75e61	15	Blood Strike	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Blood Strike	t	2025-11-19 12:51:05.33	2025-11-22 15:28:34.833	t	f	Player ID
6cd6b7db-c5df-4666-b9ef-51b0c0cb886b	30	FC Mobile (FIFA Mobile)	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม FC Mobile (FIFA Mobile)	t	2025-11-19 12:51:40.664	2025-11-22 15:28:34.832	t	f	Player ID
1a80fdd4-b126-4d05-bc44-2f2fef25981c	31	ZEPETO	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม ZEPETO	t	2025-11-19 12:51:42.254	2025-11-22 15:28:34.832	t	f	Player ID
68a00fe6-9d5e-4115-b8bf-9209a2cf44dc	41	MU Origin 3	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม MU Origin 3	t	2025-11-19 12:51:53.349	2025-11-22 15:28:34.833	t	f	Player ID
7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e	43	Sausage Man	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Sausage Man	t	2025-11-19 12:51:55.29	2025-11-22 15:28:34.833	t	f	Player ID
eede4536-64ce-4b25-a04a-909e7ba799d6	51	Onmyoji Arena	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Onmyoji Arena	t	2025-11-19 12:52:04.6	2025-11-22 15:28:34.833	t	f	Player ID
343d07db-83c8-426c-8ad6-2446e7dd8914	2	Sword of Justice	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Sword of Justice	t	2025-11-19 12:50:48.52	2025-11-22 15:28:34.832	t	f	Player ID
4c7be57c-1702-401a-a3e7-78bea1fc7258	45	MARVEL SNAP	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม MARVEL SNAP	t	2025-11-19 12:51:57.59	2025-11-22 15:28:34.832	t	f	Player ID
081afc7c-109c-4af5-ac06-3f2f3ffd0edc	46	X-HERO	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม X-HERO	t	2025-11-19 12:51:58.91	2025-11-22 15:28:34.832	t	f	Player ID
657543b4-3725-4917-800f-e41117e69104	38	Ragnarok X: Next Generation	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Ragnarok X: Next Generation	t	2025-11-19 12:51:49.045	2025-11-22 15:28:34.833	t	f	Player ID
8e557eda-5062-4dc4-8457-d091388203e6	52	Legends of Runeterra	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Legends of Runeterra	t	2025-11-19 12:52:05.499	2025-11-22 15:28:34.833	t	f	Player ID
e14cd26f-d3af-4062-88a3-df8c4e776b46	39	Harry Potter: Magic Awakened	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Harry Potter: Magic Awakened	t	2025-11-19 12:51:50.101	2025-11-22 15:28:34.833	t	t	Player ID
16bee30a-9c4d-49e5-8d90-c0f78adcd388	44	Super Sus	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Super Sus	t	2025-11-19 12:51:56.265	2025-11-22 15:28:34.833	t	f	Player ID
3d9821fe-4519-4e1e-961b-3a636ae2042a	53	League of Legends: Wild Rift	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม League of Legends: Wild Rift	t	2025-11-19 12:52:06.388	2025-11-22 15:28:34.833	t	f	Player ID
7cc68af6-955a-451f-a664-6715c946e2d7	54	Dragon Raja	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Dragon Raja	t	2025-11-19 12:52:07.31	2025-11-22 15:28:34.833	t	f	Player ID
9afd2a92-41d2-4066-a411-fa4a619ade2f	40	Ace Racer	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Ace Racer	t	2025-11-19 12:51:51.988	2025-11-22 15:28:34.833	t	t	Player ID
25252e18-d1aa-42e8-8529-5ba667e49715	55	Counter:Side	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Counter:Side	t	2025-11-19 12:52:08.456	2025-11-22 15:28:34.833	t	f	Player ID
40f6f086-ee98-401a-85d7-a4cf7a8de687	56	EOS RED	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม EOS RED	t	2025-11-19 12:52:09.338	2025-11-22 15:28:34.833	t	t	Player ID
e69a27a0-b9d2-47bb-9a41-c9fad626de69	3	Valorant	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Valorant	t	2025-11-19 12:50:49.854	2025-11-22 15:28:34.832	t	f	Player ID
b967392a-4962-451b-8b1d-9553a1802e63	0	RoV Mobile	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม RoV Mobile	t	2025-11-19 12:50:46.315	2025-11-22 15:28:34.831	t	f	Player ID
e9a182be-07a2-489c-96d5-b74c7365fe2e	47	GODDESS OF VICTORY: NIKKE	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม GODDESS OF VICTORY: NIKKE	t	2025-11-19 12:52:00.096	2025-11-22 15:28:34.832	t	t	Player ID
cc82ef95-916e-4cbc-a185-342ea8f48df6	48	Overwatch 2	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Overwatch 2	t	2025-11-19 12:52:01.549	2025-11-22 15:28:34.832	t	f	Player ID
d43f9aaf-f5f9-40bd-a409-e4055d3c28ac	49	Ragnarok M: Eternal Love	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Ragnarok M: Eternal Love	t	2025-11-19 12:52:01.991	2025-11-22 15:28:34.832	t	t	Player ID
6344984c-c24a-41d5-a3cc-603fd1224b0e	36	Ragnarok Original	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Ragnarok Original	t	2025-11-19 12:51:45.134	2025-11-22 15:28:34.832	t	f	Player ID
ecb0a2de-5636-478b-86cb-6454ac5acbe4	37	Seal M	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Seal M	t	2025-11-19 12:51:46.194	2025-11-22 15:28:34.833	t	t	Player ID
52adb8e0-1e0a-452f-bb3b-863aa463831e	50	MU Archangel	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม MU Archangel	t	2025-11-19 12:52:03.798	2025-11-22 15:28:34.833	t	f	Player ID
0b071a33-6128-41ca-aff4-40113a9399e2	42	Diablo: Immortal	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	เติมเกม Diablo: Immortal	t	2025-11-19 12:51:54.408	2025-11-22 15:28:34.833	t	f	Player ID
\.


--
-- Data for Name: mix_package; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mix_package (id, sort, name, price, "priceVip", "priceAgent", cost, icon, "isActive", "createdAt", "updatedAt", "gameId", items) FROM stdin;
\.


--
-- Data for Name: package; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.package (id, sort, name, price, "priceVip", "priceAgent", cost, "gameCode", "packageCode", icon, "isActive", "createdAt", "updatedAt", "gameId") FROM stdin;
000d3464-f296-4d36-8b81-12a8ceee7b00	0	สมาชิกเพชรรายสัปดาห์ 67 บาทได้รับ 450 Diamondโดยได้รับ 100 Diamond ทันทีและได้รับ 50 Diamond ทุกวัน เป็นเวลา 7 วัน	67.01	67.01	67.01	63.49	FREEFIRE	67.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.233	2025-11-19 12:50:45.233	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
f7baa0da-e4b7-4d0e-b012-feb6b9188dae	0	สมาชิกเพชรรายเดือน 300 บาทได้รับ 2,600 Diamondโดยได้รับ 500 Diamond ทันทีและได้รับ 70 Diamond ทุกวัน เป็นเวลา 30 วัน	300.01	300.01	300.01	284.26	FREEFIRE	300.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.321	2025-11-19 12:50:45.321	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
1882075f-488c-400d-8b6e-e2514b9d37b1	0	10 บาท ได้รับ 33 Diamond	10.00	10.00	10.00	9.48	FREEFIRE	10	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.423	2025-11-19 12:50:45.423	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
6dc43232-95af-47b3-9fad-525e09259aa3	0	20 บาท ได้รับ 68 Diamond	20.00	20.00	20.00	18.95	FREEFIRE	20	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.511	2025-11-19 12:50:45.511	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
09f08c1d-21a0-485b-a128-5d27fb332919	0	50 บาท ได้รับ 172 Diamond	50.00	50.00	50.00	47.38	FREEFIRE	50	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.601	2025-11-19 12:50:45.601	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
c156114a-09cb-4178-a3c0-f9227959f2ae	0	90 บาท ได้รับ 310 Diamond	90.00	90.00	90.00	85.28	FREEFIRE	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.688	2025-11-19 12:50:45.688	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
309fce4b-cdce-4863-aca3-a1d3824fbcad	0	150 บาท ได้รับ 517 Diamond	150.00	150.00	150.00	142.13	FREEFIRE	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.777	2025-11-19 12:50:45.777	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
4fc7dd34-a60e-42cb-97c6-31c75633aba9	0	200 บาท ได้รับ 690 Diamond	200.00	200.00	200.00	189.50	FREEFIRE	200	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.864	2025-11-19 12:50:45.864	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
f0d63a68-1369-4873-a188-670d2354cc5e	0	300 บาท ได้รับ 1,052 Diamond	300.00	300.00	300.00	284.25	FREEFIRE	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.952	2025-11-19 12:50:45.952	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
216f44da-09f8-46d4-ac6c-88398f8f4636	0	500 บาท ได้รับ 1,801 Diamond	500.00	500.00	500.00	473.75	FREEFIRE	500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:46.039	2025-11-19 12:50:46.039	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
c86105f1-40c9-4a7a-84e9-82f9a3940852	0	1,000 บาท ได้รับ 3,698 Diamond	1000.00	1000.00	1000.00	947.50	FREEFIRE	1000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:46.126	2025-11-19 12:50:46.126	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
c42895d8-6751-4706-a56e-2d41d8e80325	0	20 บาท ได้รับ 24 คูปอง	20.00	20.00	20.00	18.95	ROV-M	20	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:46.659	2025-11-19 12:50:46.659	b967392a-4962-451b-8b1d-9553a1802e63
dbbf522d-a7bc-40ce-8282-0de04e7f3999	0	50 บาท ได้รับ 60 คูปอง	50.00	50.00	50.00	47.38	ROV-M	50	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:46.749	2025-11-19 12:50:46.749	b967392a-4962-451b-8b1d-9553a1802e63
78771902-1038-4aff-8777-20c74762253d	0	90 บาท ได้รับ 110 คูปอง	90.00	90.00	90.00	85.28	ROV-M	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:46.837	2025-11-19 12:50:46.837	b967392a-4962-451b-8b1d-9553a1802e63
bdbf578a-ccc0-4291-b9f3-49c70f955ec2	0	150 บาท ได้รับ 185 คูปอง	150.00	150.00	150.00	142.13	ROV-M	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:46.925	2025-11-19 12:50:46.925	b967392a-4962-451b-8b1d-9553a1802e63
559d6ce9-c0c6-48fd-9771-994bf12b33ee	0	300 บาท ได้รับ 370 คูปอง	300.00	300.00	300.00	284.25	ROV-M	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.013	2025-11-19 12:50:47.013	b967392a-4962-451b-8b1d-9553a1802e63
dd63cc56-7180-42e2-9491-075c858441f9	0	500 บาท ได้รับ 620 คูปอง	500.00	500.00	500.00	473.75	ROV-M	500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.101	2025-11-19 12:50:47.101	b967392a-4962-451b-8b1d-9553a1802e63
86da46f3-0946-4462-921a-44260c43e1b7	0	1,000 บาท ได้รับ 1,240 คูปอง	1000.00	1000.00	1000.00	947.50	ROV-M	1000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.189	2025-11-19 12:50:47.189	b967392a-4962-451b-8b1d-9553a1802e63
9c4fff5d-d6bd-47a7-b277-c87951af972e	0	Twilight Pass 350 300 บาท	300.02	300.02	300.02	273.02	MLBB	300.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.632	2025-11-19 12:50:47.632	49dd89a1-7107-46cd-adc5-6252047e8c8f
0c1655ce-68c7-4d83-8e6a-fdd2d3f44992	0	45 บาท ได้รับ 86 Diamonds	45.00	45.00	45.00	40.95	MLBB	45	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.719	2025-11-19 12:50:47.719	49dd89a1-7107-46cd-adc5-6252047e8c8f
4efbb73d-f8a6-410d-875d-691b49f0b40d	0	90 บาท ได้รับ 172 Diamonds	90.00	90.00	90.00	81.90	MLBB	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.807	2025-11-19 12:50:47.807	49dd89a1-7107-46cd-adc5-6252047e8c8f
d5c408f6-ac22-48b2-812a-acd3404adc0d	0	135 บาท ได้รับ 257 Diamonds	135.00	135.00	135.00	122.85	MLBB	135	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.894	2025-11-19 12:50:47.894	49dd89a1-7107-46cd-adc5-6252047e8c8f
9c187461-091a-48fd-bf5c-0b752630d641	0	360 บาท ได้รับ 706 Diamonds	360.00	360.00	360.00	327.60	MLBB	360	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:47.982	2025-11-19 12:50:47.982	49dd89a1-7107-46cd-adc5-6252047e8c8f
b4f81d0a-ed0a-46a8-b98d-30b79e479bfd	0	1,080 บาท ได้รับ 2,195 Diamonds	1080.00	1080.00	1080.00	982.80	MLBB	1080	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:48.069	2025-11-19 12:50:48.069	49dd89a1-7107-46cd-adc5-6252047e8c8f
cf35ccda-0c4a-4cdb-b2bc-9cf828b8f432	0	สมาชิกเพชรมินิรายสัปดาห์ 35 บาทได้รับ 200 Diamondโดยได้รับ 60 Diamond ทันทีและได้รับ 20 Diamond ทุกวัน เป็นเวลา 7 วัน	35.00	33.31	33.31	31.56	FREEFIRE	33.31	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.144	2025-11-22 15:16:44.211	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
d1122c69-2091-4240-8758-65e57b601c42	0	12 บาท ได้รับ 11 คูปอง	12.00	10.00	10.00	9.48	ROV-M	10	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:46.572	2025-11-23 12:45:15.667	b967392a-4962-451b-8b1d-9553a1802e63
3b6031fa-c975-4ff1-9e50-5a30c613a79c	0	1,800 บาท ได้รับ 3,688 Diamonds	1800.00	1800.00	1800.00	1638.00	MLBB	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:48.157	2025-11-19 12:50:48.157	49dd89a1-7107-46cd-adc5-6252047e8c8f
3b08f72e-2737-40a9-b834-3e276422f51a	0	2,700 บาท ได้รับ 5,532 Diamonds	2700.00	2700.00	2700.00	2457.00	MLBB	2700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:48.245	2025-11-19 12:50:48.245	49dd89a1-7107-46cd-adc5-6252047e8c8f
f68d9217-4519-49e6-82c1-697edf669c03	0	4,500 บาท ได้รับ 9,288 Diamonds	4500.00	4500.00	4500.00	4095.00	MLBB	4500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:48.332	2025-11-19 12:50:48.332	49dd89a1-7107-46cd-adc5-6252047e8c8f
5e7ef4ec-5137-4831-985a-a73368d71ff7	0	Exquisite Treasures 10 บาท	10.02	10.02	10.02	7.92	SWOJTC	10.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:48.779	2025-11-19 12:50:48.779	343d07db-83c8-426c-8ad6-2446e7dd8914
a5c17ea4-4efb-4834-9e8f-9f6190b2d5f8	0	Monthly Pass 155 บาท	155.02	155.02	155.02	122.47	SWOJTC	155.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:48.866	2025-11-19 12:50:48.866	343d07db-83c8-426c-8ad6-2446e7dd8914
c49080b6-a4d8-4e33-a634-47919c344bd7	0	Basic Battle Pass 295 บาท	295.02	295.02	295.02	233.07	SWOJTC	295.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:48.954	2025-11-19 12:50:48.954	343d07db-83c8-426c-8ad6-2446e7dd8914
0eb49e54-be62-41f4-a7aa-ffe2958aa180	0	Battle Pass Upgrade 475 บาท	475.02	475.02	475.02	375.27	SWOJTC	475.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.041	2025-11-19 12:50:49.041	343d07db-83c8-426c-8ad6-2446e7dd8914
426104e2-75e6-4d35-8939-05006701c49b	0	Advanced Battle Pass 720 บาท	720.02	720.02	720.02	568.82	SWOJTC	720.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.129	2025-11-19 12:50:49.129	343d07db-83c8-426c-8ad6-2446e7dd8914
c6112fa5-d50f-4967-8bfb-3aa735df43ed	0	39 บาท ได้รับ 60 Ornate Jade	39.00	39.00	39.00	30.81	SWOJTC	39	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.216	2025-11-19 12:50:49.216	343d07db-83c8-426c-8ad6-2446e7dd8914
a42328cb-e2e6-4814-9c94-c708128c8371	0	169 บาท ได้รับ 330 Ornate Jade	169.00	169.00	169.00	133.51	SWOJTC	169	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.304	2025-11-19 12:50:49.304	343d07db-83c8-426c-8ad6-2446e7dd8914
9f7320ba-c4c6-421b-ad1a-260ef2c16575	0	529 บาท ได้รับ 1,100 Ornate Jade	529.00	529.00	529.00	417.91	SWOJTC	529	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.391	2025-11-19 12:50:49.391	343d07db-83c8-426c-8ad6-2446e7dd8914
d1ef213f-40d7-4c44-8b1f-903f008c7ca3	0	1,070 บาท ได้รับ 2,268 Ornate Jade	1070.00	1070.00	1070.00	845.30	SWOJTC	1070	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.478	2025-11-19 12:50:49.478	343d07db-83c8-426c-8ad6-2446e7dd8914
8b36a805-3b21-4f60-8679-0c38fede8141	0	1,730 บาท ได้รับ 3,808 Ornate Jade	1730.00	1730.00	1730.00	1366.70	SWOJTC	1730	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.566	2025-11-19 12:50:49.566	343d07db-83c8-426c-8ad6-2446e7dd8914
2e0ddcdc-8bc9-4825-a1a1-562edab8946c	0	3,350 บาท ได้รับ 7,776 Ornate Jade	3350.00	3350.00	3350.00	2646.50	SWOJTC	3350	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:49.655	2025-11-19 12:50:49.655	343d07db-83c8-426c-8ad6-2446e7dd8914
94431356-4919-4edb-a344-03b2ac5e4c67	0	130 บาท ได้รับ 475 Points	130.00	130.00	130.00	123.50	VALORANT-D	130	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:50.111	2025-11-19 12:50:50.111	e69a27a0-b9d2-47bb-9a41-c9fad626de69
a5b38993-33bf-47fa-9a40-960398c40578	0	260 บาท ได้รับ 1,000 Points	260.00	260.00	260.00	247.00	VALORANT-D	260	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:50.198	2025-11-19 12:50:50.198	e69a27a0-b9d2-47bb-9a41-c9fad626de69
6ba80780-6b30-4299-85a3-43f1ce143a52	0	520 บาท ได้รับ 2,050 Points	520.00	520.00	520.00	494.00	VALORANT-D	520	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:50.285	2025-11-19 12:50:50.285	e69a27a0-b9d2-47bb-9a41-c9fad626de69
791c2a82-5e16-439a-b2a8-a7f3ada84c0b	0	920 บาท ได้รับ 3,650 Points	920.00	920.00	920.00	874.00	VALORANT-D	920	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:50.373	2025-11-19 12:50:50.373	e69a27a0-b9d2-47bb-9a41-c9fad626de69
57473b9a-c8b5-4935-b0ca-f1f21cf3c514	0	1,320 บาท ได้รับ 5,350 Points	1320.00	1320.00	1320.00	1254.00	VALORANT-D	1320	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:50.461	2025-11-19 12:50:50.461	e69a27a0-b9d2-47bb-9a41-c9fad626de69
c6419959-2c0a-40c8-a451-ee1c1f0ab1cb	0	2,640 บาท ได้รับ 11,000 Points	2640.00	2640.00	2640.00	2508.00	VALORANT-D	2640	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:50.548	2025-11-19 12:50:50.548	e69a27a0-b9d2-47bb-9a41-c9fad626de69
848c381d-c991-45df-834c-20dc34efc140	0	10 บาท ได้รับ 18 Delta Coins	10.00	10.00	10.00	7.60	DELTAFORCE	10	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:50.986	2025-11-19 12:50:50.986	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
1ddd9e91-47ae-4944-96bc-0b6ab9daad1e	0	18 บาท ได้รับ 30 Delta Coins	18.00	18.00	18.00	13.68	DELTAFORCE	18	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.073	2025-11-19 12:50:51.073	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
5619d0ff-1d81-4548-b232-7cf6923f2649	0	34 บาท ได้รับ 60 Delta Coins	34.00	34.00	34.00	25.84	DELTAFORCE	34	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.16	2025-11-19 12:50:51.16	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
cdadc510-8c8b-49a6-b0ae-0c8788135820	0	175 บาท ได้รับ 320 Delta Coins	175.00	175.00	175.00	133.00	DELTAFORCE	175	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.247	2025-11-19 12:50:51.247	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
c409ddf6-300b-4802-86fc-6780ffd83849	0	250 บาท ได้รับ 460 Delta Coins	250.00	250.00	250.00	190.00	DELTAFORCE	250	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.334	2025-11-19 12:50:51.334	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
97cae10c-97ca-4743-9c06-bd484c29431b	0	345 บาท ได้รับ 750 Delta Coins	345.00	345.00	345.00	262.20	DELTAFORCE	345	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.422	2025-11-19 12:50:51.422	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
0c101c1a-f6f2-4025-a6d7-6a2c4b67a20a	0	690 บาท ได้รับ 1,480 Delta Coins	690.00	690.00	690.00	524.40	DELTAFORCE	690	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.51	2025-11-19 12:50:51.51	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
c7bbaea6-4e04-40ed-8506-cfe357b10d20	0	860 บาท ได้รับ 1,980 Delta Coins	860.00	860.00	860.00	653.60	DELTAFORCE	860	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.597	2025-11-19 12:50:51.597	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
0cda07e0-c7fa-45bd-901a-cbbf952524a6	0	1,730 บาท ได้รับ 3,950 Delta Coins	1730.00	1730.00	1730.00	1314.80	DELTAFORCE	1730	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.685	2025-11-19 12:50:51.685	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
a58f6912-fb2b-42e4-a6a2-e33183833ccb	0	3,460 บาท ได้รับ 8,100 Delta Coins	3460.00	3460.00	3460.00	2629.60	DELTAFORCE	3460	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:51.773	2025-11-19 12:50:51.773	3b8b2b36-fe45-40ec-8b06-0dc09e0026d1
722c3203-42f2-4e5b-a288-ca234b892885	0	Blaze Supplies 25 บาท	25.02	25.02	25.02	23.71	GRN-DTF	25.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.216	2025-11-19 12:50:52.216	fb41ae1b-9909-4530-b7a6-674bf756c51d
b63ce253-6342-4a0c-8434-3baa1ca8f71e	0	Blaze Supplies - Advanced 73.50 บาท	73.52	73.52	73.52	69.66	GRN-DTF	73.52	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.304	2025-11-19 12:50:52.304	fb41ae1b-9909-4530-b7a6-674bf756c51d
95c08c14-e0cd-4747-ad68-9454eabe408e	0	10 บาท ได้รับ 19 Delta Coins	10.00	10.00	10.00	9.48	GRN-DTF	10	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.391	2025-11-19 12:50:52.391	fb41ae1b-9909-4530-b7a6-674bf756c51d
78a01fbf-f0a7-4a31-9bdd-c95a6330d057	0	17 บาท ได้รับ 32 Delta Coins	17.00	17.00	17.00	16.11	GRN-DTF	17	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.478	2025-11-19 12:50:52.478	fb41ae1b-9909-4530-b7a6-674bf756c51d
53957e5c-7bb7-4e80-947f-81ef9ee731e6	0	34 บาท ได้รับ 63 Delta Coins	34.00	34.00	34.00	32.22	GRN-DTF	34	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.566	2025-11-19 12:50:52.566	fb41ae1b-9909-4530-b7a6-674bf756c51d
7e73291c-0a2a-402f-be97-3249340e09d4	0	175 บาท ได้รับ 336 Delta Coins	175.00	175.00	175.00	165.81	GRN-DTF	175	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.653	2025-11-19 12:50:52.653	fb41ae1b-9909-4530-b7a6-674bf756c51d
f9daade6-7d03-4682-9a1d-29a624591acc	0	245 บาท ได้รับ 482 Delta Coins	245.00	245.00	245.00	232.14	GRN-DTF	245	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.741	2025-11-19 12:50:52.741	fb41ae1b-9909-4530-b7a6-674bf756c51d
52b8f21c-39af-4b49-a0ad-b157ec37d5ad	0	345 บาท ได้รับ 785 Delta Coins	345.00	345.00	345.00	326.89	GRN-DTF	345	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.829	2025-11-19 12:50:52.829	fb41ae1b-9909-4530-b7a6-674bf756c51d
62c3fa47-b36c-4c3a-8962-6c6e4552a476	0	690 บาท ได้รับ 1,544 Delta Coins	690.00	690.00	690.00	653.78	GRN-DTF	690	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:52.917	2025-11-19 12:50:52.917	fb41ae1b-9909-4530-b7a6-674bf756c51d
e054bdda-904b-4ac5-88fa-b454b4b0c3f6	0	865 บาท ได้รับ 2,065 Delta Coins	865.00	865.00	865.00	819.59	GRN-DTF	865	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:53.004	2025-11-19 12:50:53.004	fb41ae1b-9909-4530-b7a6-674bf756c51d
b1392308-caa8-494e-8c91-e03005dc37b9	0	1,730 บาท ได้รับ 4,114 Delta Coins	1730.00	1730.00	1730.00	1639.18	GRN-DTF	1730	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:53.093	2025-11-19 12:50:53.093	fb41ae1b-9909-4530-b7a6-674bf756c51d
af269e35-ea0a-4f1b-9493-3bb39445ff1a	0	3,460 บาท ได้รับ 8,424 Delta Coins	3460.00	3460.00	3460.00	3278.35	GRN-DTF	3460	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:53.191	2025-11-19 12:50:53.191	fb41ae1b-9909-4530-b7a6-674bf756c51d
121fe5d9-8af5-4e43-89af-fb522083f61a	0	6,920 บาท ได้รับ 16,848 Delta Coins	6920.00	6920.00	6920.00	6556.70	GRN-DTF	6920	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:53.279	2025-11-19 12:50:53.279	fb41ae1b-9909-4530-b7a6-674bf756c51d
19c6ce3a-66ba-4e4a-b961-26e4c5a276e3	0	10,400 บาท ได้รับ 25,272 Delta Coins	10400.00	10400.00	10400.00	9854.00	GRN-DTF	10400	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:53.366	2025-11-19 12:50:53.366	fb41ae1b-9909-4530-b7a6-674bf756c51d
f9c63e7a-7e6d-448c-9296-98cdec6c5027	0	33 บาท ได้รับ 60 UC	33.00	33.00	33.00	28.71	PUBGM	33	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:53.825	2025-11-19 12:50:53.825	ea63faf5-ab09-42a2-9f5f-a151dc03dbeb
a34de48d-29f8-43d2-a3d9-56d817261925	0	165 บาท ได้รับ 325 UC	165.00	165.00	165.00	143.55	PUBGM	165	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:53.914	2025-11-19 12:50:53.914	ea63faf5-ab09-42a2-9f5f-a151dc03dbeb
9688d4c9-55bb-4da8-89a0-0ce5a777db68	0	330 บาท ได้รับ 660 UC	330.00	330.00	330.00	287.10	PUBGM	330	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.001	2025-11-19 12:50:54.001	ea63faf5-ab09-42a2-9f5f-a151dc03dbeb
ecdf14fe-02c4-41a7-abc5-3db2267bbe0a	0	825 บาท ได้รับ 1,800 UC	825.00	825.00	825.00	717.75	PUBGM	825	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.088	2025-11-19 12:50:54.088	ea63faf5-ab09-42a2-9f5f-a151dc03dbeb
da40745c-8f4b-4bc3-b1f5-7831a0d9bc1d	0	1,650 บาท ได้รับ 3,850 UC	1650.00	1650.00	1650.00	1435.50	PUBGM	1650	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.175	2025-11-19 12:50:54.175	ea63faf5-ab09-42a2-9f5f-a151dc03dbeb
665e2d69-0b6d-487b-905b-a8393b03fa55	0	3,300 บาท ได้รับ 8,100 UC	3300.00	3300.00	3300.00	2871.00	PUBGM	3300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.262	2025-11-19 12:50:54.262	ea63faf5-ab09-42a2-9f5f-a151dc03dbeb
ab87a458-308f-44d8-b6ab-740d24343fd8	0	แพ็คอัพเกรด RP 396 บาท &#9656; บัตรอัพเกรด Royale RP &#9656; 100 UC &#9656; รับรางวัลเพิ่มสูงสุดถึง 60 UC (ต้องใช้คูปอง RP)	396.00	396.00	396.00	336.60	PUBGM-D	396	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.704	2025-11-19 12:50:54.704	3c60946f-a92c-4e76-9e6e-acad8129f474
b2de2ff4-dc86-4a80-943f-29a23b8e462c	0	แพ็คอัพเกรด Elite RP 990 บาท &#9656; บัตรอัพเกรด Elite RP &#9656; 240 UC &#9656; รับรางวัลเพิ่มสูงสุดถึง 60 UC (ต้องใช้คูปอง RP)	990.00	990.00	990.00	841.50	PUBGM-D	990	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.791	2025-11-19 12:50:54.791	3c60946f-a92c-4e76-9e6e-acad8129f474
5dd9c658-13d1-473e-9055-23aa2c81b375	0	33 บาท ได้รับ 60 UC	33.00	33.00	33.00	28.05	PUBGM-D	33	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.879	2025-11-19 12:50:54.879	3c60946f-a92c-4e76-9e6e-acad8129f474
f42f7750-c9b1-43b2-bc34-4388ea69fb99	0	165 บาท ได้รับ 300 UC+ โบนัส 25 UC รวม 325 UC	165.00	165.00	165.00	140.25	PUBGM-D	165	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:54.966	2025-11-19 12:50:54.966	3c60946f-a92c-4e76-9e6e-acad8129f474
fecff490-5d39-42a2-a387-d257b978ca98	0	330 บาท ได้รับ 600 UC+ โบนัส 60 UC รวม 660 UC	330.00	330.00	330.00	280.50	PUBGM-D	330	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:55.053	2025-11-19 12:50:55.053	3c60946f-a92c-4e76-9e6e-acad8129f474
d070e50b-a30d-4ec7-8cdb-2c319143aaab	0	825 บาท ได้รับ 1,500 UC+ โบนัส 300 UC รวม 1,800 UC	825.00	825.00	825.00	701.25	PUBGM-D	825	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:55.141	2025-11-19 12:50:55.141	3c60946f-a92c-4e76-9e6e-acad8129f474
a973800d-218c-47e8-8e6a-391e7d5a7add	0	1,650 บาท ได้รับ 3,000 UC+ โบนัส 850 UC รวม 3,850 UC	1650.00	1650.00	1650.00	1402.50	PUBGM-D	1650	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:55.228	2025-11-19 12:50:55.228	3c60946f-a92c-4e76-9e6e-acad8129f474
453a16c0-b0ff-4dbf-8191-eed18fbf0dfe	0	3,300 บาท ได้รับ 6,000 UC+ โบนัส 2,100 UC รวม 8,100 UC	3300.00	3300.00	3300.00	2805.00	PUBGM-D	3300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:55.316	2025-11-19 12:50:55.316	3c60946f-a92c-4e76-9e6e-acad8129f474
123148d8-a7cc-4654-a665-a20d52c0fc43	0	0 บาท	0.00	0.00	0.00	0.00	PUBGM-RAZER	0	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:55.754	2025-11-19 12:50:55.754	65978655-fba0-4e2a-9df1-2701b217b421
929e5ae8-f3d7-4e42-aab1-3b4166b71bbb	0	0 บาท	0.00	0.00	0.00	0.00	SKRE	0	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:56.195	2025-11-19 12:50:56.195	ab37b300-d292-41ac-ae05-b7c9a8f03b0e
31812c5b-5619-476c-b797-0ad23021681f	0	17 บาทได้รับ 25 Diamonds	17.00	17.00	17.00	15.81	BIGOLIVE	17	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:56.639	2025-11-19 12:50:56.639	b7d4c274-dced-40c7-83dc-8f32186e9ef2
8b405450-b1a0-4817-81ae-e8b082fce449	0	33 บาทได้รับ 50 Diamonds	33.00	33.00	33.00	30.69	BIGOLIVE	33	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:56.726	2025-11-19 12:50:56.726	b7d4c274-dced-40c7-83dc-8f32186e9ef2
6da31654-4d8c-4d8f-b4d7-28f41fb473d2	0	67 บาทได้รับ 100 Diamonds	67.00	67.00	67.00	62.31	BIGOLIVE	67	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:56.814	2025-11-19 12:50:56.814	b7d4c274-dced-40c7-83dc-8f32186e9ef2
9794deb5-a56d-48fa-8031-038dd68e5285	0	100 บาทได้รับ 150 Diamonds	100.00	100.00	100.00	93.00	BIGOLIVE	100	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:56.901	2025-11-19 12:50:56.901	b7d4c274-dced-40c7-83dc-8f32186e9ef2
0d4f6da5-db9d-4d7f-ae31-257fa0b24d38	0	134 บาทได้รับ 200 Diamonds	134.00	134.00	134.00	124.62	BIGOLIVE	134	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:56.99	2025-11-19 12:50:56.99	b7d4c274-dced-40c7-83dc-8f32186e9ef2
0a34a0a3-0258-43d9-87d1-d705dc825bf7	0	167 บาทได้รับ 250 Diamonds	167.00	167.00	167.00	155.31	BIGOLIVE	167	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.077	2025-11-19 12:50:57.077	b7d4c274-dced-40c7-83dc-8f32186e9ef2
213f986e-79e9-4977-a75a-62507b3fce0c	0	200 บาทได้รับ 300 Diamonds	200.00	200.00	200.00	186.00	BIGOLIVE	200	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.166	2025-11-19 12:50:57.166	b7d4c274-dced-40c7-83dc-8f32186e9ef2
495d9096-7fff-463a-bb7b-794c91c932a3	0	334 บาทได้รับ 500 Diamonds	334.00	334.00	334.00	310.62	BIGOLIVE	334	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.253	2025-11-19 12:50:57.253	b7d4c274-dced-40c7-83dc-8f32186e9ef2
db1eb10b-4794-4995-b23a-ba502f000c97	0	501 บาทได้รับ 750 Diamonds	501.00	501.00	501.00	465.93	BIGOLIVE	501	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.34	2025-11-19 12:50:57.34	b7d4c274-dced-40c7-83dc-8f32186e9ef2
8e55436b-88bc-45ff-8acf-03b11295f77f	0	668 บาทได้รับ 1,000 Diamonds	668.00	668.00	668.00	621.24	BIGOLIVE	668	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.429	2025-11-19 12:50:57.429	b7d4c274-dced-40c7-83dc-8f32186e9ef2
3fe32219-2304-4dbc-9b78-4ef6f628a6df	0	1,336 บาทได้รับ 2,000 Diamonds	1336.00	1336.00	1336.00	1242.48	BIGOLIVE	1336	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.518	2025-11-19 12:50:57.518	b7d4c274-dced-40c7-83dc-8f32186e9ef2
2c65d4a1-cf94-4a39-85cc-eb3cb8069e7f	0	2,004 บาทได้รับ 3,000 Diamonds	2004.00	2004.00	2004.00	1863.72	BIGOLIVE	2004	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.607	2025-11-19 12:50:57.607	b7d4c274-dced-40c7-83dc-8f32186e9ef2
c6322ee4-d43e-4c00-ab08-75b3d9db0cb8	0	2,672 บาทได้รับ 4,000 Diamonds	2672.00	2672.00	2672.00	2484.96	BIGOLIVE	2672	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.694	2025-11-19 12:50:57.694	b7d4c274-dced-40c7-83dc-8f32186e9ef2
11a260ba-1886-4543-9a5c-9b33954470da	0	3,339 บาทได้รับ 5,000 Diamonds	3339.00	3339.00	3339.00	3105.27	BIGOLIVE	3339	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.782	2025-11-19 12:50:57.782	b7d4c274-dced-40c7-83dc-8f32186e9ef2
e619caac-6c6e-401d-b7b2-73172ff68c38	0	5,009 บาทได้รับ 7,500 Diamonds	5009.00	5009.00	5009.00	4658.37	BIGOLIVE	5009	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.869	2025-11-19 12:50:57.869	b7d4c274-dced-40c7-83dc-8f32186e9ef2
1e28845a-49b2-4a6d-ab9a-0863605c67f8	0	6,679 บาทได้รับ 10,000 Diamonds	6679.00	6679.00	6679.00	6211.47	BIGOLIVE	6679	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:57.957	2025-11-19 12:50:57.957	b7d4c274-dced-40c7-83dc-8f32186e9ef2
2122f3a7-ec06-4c9a-b3f1-1445d938488a	0	แพ็กพิเศษสำหรับมือใหม่ 9 บาท	9.02	9.02	9.02	7.22	RCMASTER	9.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:58.401	2025-11-19 12:50:58.401	3aa46dfa-5808-456e-bf85-ab0ffea8330a
a3b73b20-93e8-47d8-8436-547371f652e1	0	บัตรรายสัปดาห์ 32 บาท	32.02	32.02	32.02	25.62	RCMASTER	32.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:58.489	2025-11-19 12:50:58.489	3aa46dfa-5808-456e-bf85-ab0ffea8330a
1a3b4a63-9316-43c3-ba0e-a248f60854ac	0	แพ็กแฟชั่นสุดคุ้ม 32 บาท	32.03	32.03	32.03	25.62	RCMASTER	32.03	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:58.575	2025-11-19 12:50:58.575	3aa46dfa-5808-456e-bf85-ab0ffea8330a
00a99b13-22bc-4243-9301-bf16cb252d21	0	บัตรรายเดือน 75 บาท	75.02	75.02	75.02	60.02	RCMASTER	75.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:58.663	2025-11-19 12:50:58.663	3aa46dfa-5808-456e-bf85-ab0ffea8330a
5d158db3-4793-44f1-9631-184b67372a81	0	อัพเกรดสัญญาซีซั่นพิเศษ 150 บาทอัพเกรดจาก สัญญาซีซั่นขั้นสูงเป็น สัญญาซีซั่นพิเศษ	150.02	150.02	150.02	120.02	RCMASTER	150.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:58.75	2025-11-19 12:50:58.75	3aa46dfa-5808-456e-bf85-ab0ffea8330a
33ff5164-54bc-4df1-ad1c-854621e02abf	0	สัญญาซีซั่นขั้นสูง 159 บาท	159.02	159.02	159.02	127.22	RCMASTER	159.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:58.838	2025-11-19 12:50:58.838	3aa46dfa-5808-456e-bf85-ab0ffea8330a
48d908e3-0cb6-4091-a783-392647f3529f	0	กองทุนพัฒนา 210 บาท	210.02	210.02	210.02	168.02	RCMASTER	210.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:58.927	2025-11-19 12:50:58.927	3aa46dfa-5808-456e-bf85-ab0ffea8330a
2d16cbaa-0f98-4dce-b05d-0c0f2d317244	0	สัญญาซีซั่นพิเศษ 309 บาท	309.02	309.02	309.02	247.22	RCMASTER	309.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.018	2025-11-19 12:50:59.018	3aa46dfa-5808-456e-bf85-ab0ffea8330a
66fe1d93-5095-4784-b229-b5121eea0c98	0	แพ็กสุดคุ้มจากมอเตอร์โชว์ 329 บาท10 กุญแจอัญมณี	329.02	329.02	329.02	263.22	RCMASTER	329.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.106	2025-11-19 12:50:59.106	3aa46dfa-5808-456e-bf85-ab0ffea8330a
c19d98a9-a31c-4607-afac-dad9f319dcf9	0	แพ็กสุดคุ้มจากมอเตอร์โชว์ 479 บาท15 กุญแจอัญมณี	479.02	479.02	479.02	383.22	RCMASTER	479.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.195	2025-11-19 12:50:59.195	3aa46dfa-5808-456e-bf85-ab0ffea8330a
9ece561c-2b68-4530-91c6-9f60e39d30c0	0	แพ็กสุดคุ้มจากมอเตอร์โชว์ 3,090 บาท100 กุญแจอัญมณี	3090.02	3090.02	3090.02	2472.02	RCMASTER	3090.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.282	2025-11-19 12:50:59.282	3aa46dfa-5808-456e-bf85-ab0ffea8330a
283c309b-4b35-42ff-9740-7b00b2bed9a7	0	32 บาทได้รับ 74 Gems	32.00	32.00	32.00	25.60	RCMASTER	32	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.37	2025-11-19 12:50:59.37	3aa46dfa-5808-456e-bf85-ab0ffea8330a
644d168f-a131-4b73-a111-61ba5a87a74f	0	163 บาทได้รับ 368 Gems	163.00	163.00	163.00	130.40	RCMASTER	163	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.457	2025-11-19 12:50:59.457	3aa46dfa-5808-456e-bf85-ab0ffea8330a
aa775a1a-7ca6-410a-842e-f24c1af34c66	0	329 บาทได้รับ 735 Gems	329.00	329.00	329.00	263.20	RCMASTER	329	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.587	2025-11-19 12:50:59.587	3aa46dfa-5808-456e-bf85-ab0ffea8330a
fae91048-10ab-49e8-bb85-78d6b122848b	0	479 บาทได้รับ 1,050 Gems	479.00	479.00	479.00	383.20	RCMASTER	479	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.674	2025-11-19 12:50:59.674	3aa46dfa-5808-456e-bf85-ab0ffea8330a
48cbed23-83e4-4ab5-afc3-1af3c655a249	0	669 บาทได้รับ 1,470 Gems	669.00	669.00	669.00	535.20	RCMASTER	669	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.762	2025-11-19 12:50:59.762	3aa46dfa-5808-456e-bf85-ab0ffea8330a
1f02bb30-4e88-4ef2-9b74-0932b06e53a5	0	999 บาทได้รับ 2,205 Gems	999.00	999.00	999.00	799.20	RCMASTER	999	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.849	2025-11-19 12:50:59.849	3aa46dfa-5808-456e-bf85-ab0ffea8330a
d6a0cbb4-1415-43f2-9733-016019d8a2aa	0	1,590 บาทได้รับ 3,570 Gems	1590.00	1590.00	1590.00	1272.00	RCMASTER	1590	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:59.936	2025-11-19 12:50:59.936	3aa46dfa-5808-456e-bf85-ab0ffea8330a
32a15557-bed8-4883-bcaa-cebfba67de02	0	3,090 บาทได้รับ 6,930 Gems	3090.00	3090.00	3090.00	2472.00	RCMASTER	3090	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.026	2025-11-19 12:51:00.026	3aa46dfa-5808-456e-bf85-ab0ffea8330a
a0be466f-1cb9-456b-8e96-44beb91a1bbf	0	9 6.6 บาทได้รับ 16 Token	6.60	6.60	6.60	5.94	HOKINGS	6.6	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.463	2025-11-19 12:51:00.463	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
fc82d38b-1124-4b81-b2f3-15cb3adf6af5	0	34 บาทได้รับ 80 Token	34.00	34.00	34.00	30.60	HOKINGS	34	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.551	2025-11-19 12:51:00.551	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
e131f8f5-0910-4ff3-92f4-ef5a89770201	0	99 บาทได้รับ 240 Token	99.00	99.00	99.00	89.10	HOKINGS	99	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.639	2025-11-19 12:51:00.639	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
f46583dc-9d64-493d-922d-87141dd43f3b	0	199 169 บาทได้รับ 400 Token	169.00	169.00	169.00	152.10	HOKINGS	169	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.729	2025-11-19 12:51:00.729	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
5756168e-53b2-4cb6-860d-003769971f9d	0	299 239 บาทได้รับ 560 Token	239.00	239.00	239.00	215.10	HOKINGS	239	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.817	2025-11-19 12:51:00.817	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
32c8a207-4e1f-4c34-8def-0affcd06d600	0	399 339 บาทได้รับ 830 Token	339.00	339.00	339.00	305.10	HOKINGS	339	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.905	2025-11-19 12:51:00.905	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
7d9aa995-cb72-400d-8c74-7050d22a3061	0	499 บาทได้รับ 1,245 Token	499.00	499.00	499.00	449.10	HOKINGS	499	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:00.993	2025-11-19 12:51:00.993	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
c0627a44-ac6a-4adf-92ef-4438f2077b5d	0	999 บาทได้รับ 2,508 Token	999.00	999.00	999.00	899.10	HOKINGS	999	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:01.08	2025-11-19 12:51:01.08	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
901f42b4-e37b-4dcc-a5d3-9c5c4ad15be6	0	1,990 1,669 บาทได้รับ 4,180 Token	1669.00	1669.00	1669.00	1502.10	HOKINGS	1669	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:01.167	2025-11-19 12:51:01.167	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
89de703f-2263-4540-b98b-30aa9c14456a	0	3,990 3,319 บาทได้รับ 8,360 Token	3319.00	3319.00	3319.00	2987.10	HOKINGS	3319	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:01.256	2025-11-19 12:51:01.256	ec2f21c7-1392-419b-9e67-1bf9a3bc1c31
7b183c05-e45b-4045-817a-32d67fa473f7	0	Party Jessy 3 Days Access 18 บาท	18.02	18.02	18.02	15.14	DUNKCITY	18.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:01.696	2025-11-19 12:51:01.696	127d0036-b938-4019-b025-699a62f3fb24
5c875f16-8303-48f6-98e1-527967a9d8e0	0	Party Jessy 7 Days Access 29 บาท	29.02	29.02	29.02	24.38	DUNKCITY	29.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:01.785	2025-11-19 12:51:01.785	127d0036-b938-4019-b025-699a62f3fb24
a82f7016-3d9d-4ddd-9dcc-1a9f98aecc2c	0	Party Jessy 28 Days Access 99 97 บาท	97.03	97.03	97.03	81.51	DUNKCITY	97.03	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:01.873	2025-11-19 12:51:01.873	127d0036-b938-4019-b025-699a62f3fb24
855e64e5-c6b0-4103-abfc-5ce8a04b1fd5	0	Rookie Gift Pack 99 97 บาท	97.02	97.02	97.02	81.50	DUNKCITY	97.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:01.962	2025-11-19 12:51:01.962	127d0036-b938-4019-b025-699a62f3fb24
0839b543-8709-48a1-9a5e-431d8b8119cd	0	Party Membership 199 159 บาท	159.02	159.02	159.02	133.58	DUNKCITY	159.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.049	2025-11-19 12:51:02.049	127d0036-b938-4019-b025-699a62f3fb24
956218ed-fa5c-478a-8c04-c16f30d75a13	0	Superstar Warmup Pack 199 159 บาท	159.03	159.03	159.03	133.59	DUNKCITY	159.03	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.137	2025-11-19 12:51:02.137	127d0036-b938-4019-b025-699a62f3fb24
e5dba803-a31a-45de-a575-4ca082bf0d37	0	Star Player Selected Pack 199 159 บาท	159.04	159.04	159.04	133.59	DUNKCITY	159.04	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.227	2025-11-19 12:51:02.227	127d0036-b938-4019-b025-699a62f3fb24
c5b9ed19-3433-42af-9be3-ab6070e1ddbe	0	Premium Pass 199 189 บาท	189.02	189.02	189.02	158.78	DUNKCITY	189.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.315	2025-11-19 12:51:02.315	127d0036-b938-4019-b025-699a62f3fb24
64ecef94-d22d-48c7-8fb4-9f67d6caa7bf	0	Extra Premium Pass 399 319 บาท	319.02	319.02	319.02	267.98	DUNKCITY	319.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.404	2025-11-19 12:51:02.404	127d0036-b938-4019-b025-699a62f3fb24
d67cd43e-ea38-4cb9-b0c6-940ba938976c	0	Fashion Pack 399 319 บาท	319.03	319.03	319.03	267.99	DUNKCITY	319.03	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.492	2025-11-19 12:51:02.492	127d0036-b938-4019-b025-699a62f3fb24
3578aa60-8dd5-4fbf-8c4e-44a23ea6574f	0	Star Player Treasure Pack 399 319 บาท	319.04	319.04	319.04	267.99	DUNKCITY	319.04	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.58	2025-11-19 12:51:02.58	127d0036-b938-4019-b025-699a62f3fb24
4572856f-4fe9-4fdc-bd70-a4a2f54d92da	0	Party Permanent Vip 499 บาท	499.02	499.02	499.02	419.18	DUNKCITY	499.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.667	2025-11-19 12:51:02.667	127d0036-b938-4019-b025-699a62f3fb24
1b107eb0-10f1-4147-8264-7385a9544e19	0	Star Player Sparkle Pack 699 649 บาท	649.02	649.02	649.02	545.18	DUNKCITY	649.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.755	2025-11-19 12:51:02.755	127d0036-b938-4019-b025-699a62f3fb24
ac92049b-b8c9-4eaf-9c39-711230bfa670	0	199 159 บาทได้รับ 330 Token	159.00	159.00	159.00	133.56	DUNKCITY	159	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.842	2025-11-19 12:51:02.842	127d0036-b938-4019-b025-699a62f3fb24
0e681f1e-7e5b-4f19-a99d-8609eb1107dd	0	499 บาทได้รับ 1,110 Token	499.00	499.00	499.00	419.16	DUNKCITY	499	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:02.932	2025-11-19 12:51:02.932	127d0036-b938-4019-b025-699a62f3fb24
397398c7-ec60-4c02-b6fd-18272737bbfb	0	999 959 บาทได้รับ 2,280 Token	959.00	959.00	959.00	805.56	DUNKCITY	959	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.019	2025-11-19 12:51:03.019	127d0036-b938-4019-b025-699a62f3fb24
837d8437-9737-459b-9883-bda0d2104006	0	1,990 1,599 บาทได้รับ 3,880 Token	1599.00	1599.00	1599.00	1343.16	DUNKCITY	1599	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.107	2025-11-19 12:51:03.107	127d0036-b938-4019-b025-699a62f3fb24
6e74bfee-8514-46c0-831c-22a40626a135	0	3,990 3,099 บาทได้รับ 8,110 Token	3099.00	3099.00	3099.00	2603.16	DUNKCITY	3099	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.194	2025-11-19 12:51:03.194	127d0036-b938-4019-b025-699a62f3fb24
7b927cf7-c2a2-454d-bb96-5611c854173f	0	37 บาท ได้รับ 100 Lattices	37.00	37.00	37.00	27.38	MARVEL-RV	37	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.642	2025-11-19 12:51:03.642	1f0b4198-a1d6-44d1-870a-d303d6789a3e
01e3fa84-9beb-417a-a0be-cecf3ad26989	0	185 บาท ได้รับ 500 Lattices	185.00	185.00	185.00	136.90	MARVEL-RV	185	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.729	2025-11-19 12:51:03.729	1f0b4198-a1d6-44d1-870a-d303d6789a3e
18229c7d-3b4f-4119-80a5-93fd95be5544	0	370 บาท ได้รับ 1,000 Lattices	370.00	370.00	370.00	273.80	MARVEL-RV	370	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.816	2025-11-19 12:51:03.816	1f0b4198-a1d6-44d1-870a-d303d6789a3e
12c9b03b-74eb-40b5-a679-030160ad2b28	0	740 บาท ได้รับ 2,180 Lattices	740.00	740.00	740.00	547.60	MARVEL-RV	740	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.904	2025-11-19 12:51:03.904	1f0b4198-a1d6-44d1-870a-d303d6789a3e
4df0ea27-5922-41b6-92a3-8686d0d60c63	0	1,850 บาท ได้รับ 5,680 Lattices	1850.00	1850.00	1850.00	1369.00	MARVEL-RV	1850	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:03.994	2025-11-19 12:51:03.994	1f0b4198-a1d6-44d1-870a-d303d6789a3e
790f2b5d-74ff-46b9-a4fc-6a7040f091fc	0	3,700 บาท ได้รับ 11,680 Lattices	3700.00	3700.00	3700.00	2738.00	MARVEL-RV	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:04.081	2025-11-19 12:51:04.081	1f0b4198-a1d6-44d1-870a-d303d6789a3e
b3c3c712-3f3f-4610-aa71-506e89c65b12	0	20 บาท ได้รับ 48 CP	20.00	20.00	20.00	18.95	COD-M	20	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:04.528	2025-11-19 12:51:04.528	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
106f8195-e574-42fe-98b3-dc2c5009b1d1	0	50 บาท ได้รับ 126 CP	50.00	50.00	50.00	47.38	COD-M	50	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:04.621	2025-11-19 12:51:04.621	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
c73487f8-ff9b-43fc-ba0c-8b2fea9fcc51	0	90 บาท ได้รับ 227 CP	90.00	90.00	90.00	85.28	COD-M	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:04.708	2025-11-19 12:51:04.708	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
dfc720da-e27d-49ee-b4c1-00320e86d525	0	100 บาท ได้รับ 252 CP	100.00	100.00	100.00	94.75	COD-M	100	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:04.795	2025-11-19 12:51:04.795	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
fd73d336-7ef3-42e4-8c7a-59c519b7d48f	0	150 บาท ได้รับ 378 CP	150.00	150.00	150.00	142.13	COD-M	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:04.884	2025-11-19 12:51:04.884	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
1af30721-9543-4a6c-b7a5-f38449ad6318	0	300 บาท ได้รับ 792 CP	300.00	300.00	300.00	284.25	COD-M	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:04.971	2025-11-19 12:51:04.971	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
9f0142d3-16ee-47cb-adfd-c76873a3d84e	0	500 บาท ได้รับ 1,440 CP	500.00	500.00	500.00	473.75	COD-M	500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:05.059	2025-11-19 12:51:05.059	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
3d7252d6-554d-45da-8024-5cad33c491c4	0	1,000 บาท ได้รับ 3,000 CP	1000.00	1000.00	1000.00	947.50	COD-M	1000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:05.147	2025-11-19 12:51:05.147	94f44b85-f7fb-4243-a6a4-db9c3dfd36f8
3d0ad41b-c202-4ccb-be97-88f34514b85f	0	39 บาทได้รับ 100 Golds	39.00	39.00	39.00	25.94	BLOODSTRK	39	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:05.586	2025-11-19 12:51:05.586	9af470de-4f67-4067-b9da-f64beed75e61
2862df5f-f1fe-43b8-9ac8-3d8bb24e5b64	0	119 บาทได้รับ 300 Golds	119.00	119.00	119.00	79.13	BLOODSTRK	119	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:05.674	2025-11-19 12:51:05.674	9af470de-4f67-4067-b9da-f64beed75e61
b8c9c4fb-7f2f-41f1-b31f-843ebef69ee0	0	199 บาทได้รับ 500 Golds	199.00	199.00	199.00	132.34	BLOODSTRK	199	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:05.761	2025-11-19 12:51:05.761	9af470de-4f67-4067-b9da-f64beed75e61
9bee03bf-1894-4ac0-a208-499ba473157d	0	399 บาทได้รับ 1,000 Golds	399.00	399.00	399.00	265.34	BLOODSTRK	399	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:05.848	2025-11-19 12:51:05.848	9af470de-4f67-4067-b9da-f64beed75e61
96b5b2cb-2142-4f21-a638-0f3195731b03	0	799 บาทได้รับ 2,000 Golds	799.00	799.00	799.00	531.34	BLOODSTRK	799	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:05.936	2025-11-19 12:51:05.936	9af470de-4f67-4067-b9da-f64beed75e61
788c6ef2-0093-44b6-bd22-16cfa0edc6b4	0	1990 บาทได้รับ 5,000 Golds	1990.00	1990.00	1990.00	1323.35	BLOODSTRK	1990	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:06.024	2025-11-19 12:51:06.024	9af470de-4f67-4067-b9da-f64beed75e61
dd937645-4af3-4302-b780-7025e1735ccb	0	130 บาท ได้รับ 575 RP	130.00	130.00	130.00	123.50	LOL	130	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:06.47	2025-11-19 12:51:06.47	00cd0fc8-fcd8-43bb-b8ce-6b8839d4c7ba
8e8ade22-a020-4f1e-8a43-d7f2f9aaa31c	0	290 บาท ได้รับ 1,380 RP	290.00	290.00	290.00	275.50	LOL	290	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:06.559	2025-11-19 12:51:06.559	00cd0fc8-fcd8-43bb-b8ce-6b8839d4c7ba
c1d9186c-3a4c-46bc-9f13-dea0deece3f2	0	560 บาท ได้รับ 2,800 RP	560.00	560.00	560.00	532.00	LOL	560	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:06.647	2025-11-19 12:51:06.647	00cd0fc8-fcd8-43bb-b8ce-6b8839d4c7ba
f2382595-b257-4ff9-b458-2c6054da1d33	0	890 บาท ได้รับ 4,500 RP	890.00	890.00	890.00	845.50	LOL	890	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:06.74	2025-11-19 12:51:06.74	00cd0fc8-fcd8-43bb-b8ce-6b8839d4c7ba
5b27b613-70a6-4ac9-abe1-bb66dd89edaa	0	1,250 บาท ได้รับ 6,500 RP	1250.00	1250.00	1250.00	1187.50	LOL	1250	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:06.83	2025-11-19 12:51:06.83	00cd0fc8-fcd8-43bb-b8ce-6b8839d4c7ba
4d63629d-3a2d-4cca-8513-8ce3da7cee70	0	2,550 บาท ได้รับ 13,500 RP	2550.00	2550.00	2550.00	2422.50	LOL	2550	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:06.918	2025-11-19 12:51:06.918	00cd0fc8-fcd8-43bb-b8ce-6b8839d4c7ba
af0c3f68-a51b-4bba-8425-1cfa646b84fe	0	3.30 บาท ได้รับ 5 Diamonds	3.30	3.30	3.30	2.69	MAGICCHESS	3.3	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:07.371	2025-11-19 12:51:07.371	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
c4aa9409-7853-44a4-be34-e1575d1de490	0	7 บาท ได้รับ 11 Diamonds	7.00	7.00	7.00	5.71	MAGICCHESS	7	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:07.463	2025-11-19 12:51:07.463	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
1e0f4f84-360a-441f-8b36-1360c544be55	0	13 บาท ได้รับ 22 Diamonds	13.00	13.00	13.00	10.60	MAGICCHESS	13	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:07.553	2025-11-19 12:51:07.553	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
641f75a7-9172-4412-a616-b17a80849af8	0	33 บาท ได้รับ 56 Diamonds	33.00	33.00	33.00	26.90	MAGICCHESS	33	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:07.645	2025-11-19 12:51:07.645	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
fa8d2c47-5111-4fd6-a3cb-640d2e1aee1b	0	66 บาท ได้รับ 112 Diamonds	66.00	66.00	66.00	53.79	MAGICCHESS	66	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:07.734	2025-11-19 12:51:07.734	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
28aef0a2-c7e8-4ccf-9801-22d9794095f5	0	125 บาท ได้รับ 223 Diamonds	125.00	125.00	125.00	101.88	MAGICCHESS	125	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:07.822	2025-11-19 12:51:07.822	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
a55381f5-0ff9-4f4c-bb41-d3de4cfd1f17	0	199 บาท ได้รับ 336 Diamonds	199.00	199.00	199.00	162.19	MAGICCHESS	199	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:07.917	2025-11-19 12:51:07.917	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
a97a2154-dad8-4865-a949-38d84626e484	0	325 บาท ได้รับ 570 Diamonds	325.00	325.00	325.00	264.88	MAGICCHESS	325	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.006	2025-11-19 12:51:08.006	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
1229f638-d36b-4bb3-984f-fc88998d192f	0	649 บาท ได้รับ 1,163 Diamonds	649.00	649.00	649.00	528.93	MAGICCHESS	649	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.094	2025-11-19 12:51:08.094	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
6db3e83c-7a36-4948-91d0-71b43a679f5e	0	1,299 บาท ได้รับ 2,398 Diamonds	1299.00	1299.00	1299.00	1058.69	MAGICCHESS	1299	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.182	2025-11-19 12:51:08.182	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
652ef574-2e28-479f-a369-e621f9f40eeb	0	3,199 บาท ได้รับ 6,042 Diamonds	3199.00	3199.00	3199.00	2607.19	MAGICCHESS	3199	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.27	2025-11-19 12:51:08.27	cbbf3a0b-b859-4163-a908-dc52a7bdc50c
efbdf050-c74e-4cb3-afdf-dd8d709b9223	0	39 35 บาท ได้รับ 60 Star Gems	35.00	35.00	35.00	31.59	HAIKYUFH	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.713	2025-11-19 12:51:08.713	bce19e7a-e761-493c-93ba-092ef32537fc
7f68af7c-8a7c-41c5-bea2-edde85f3ba2a	0	175 บาท ได้รับ 300 Star Gems	175.00	175.00	175.00	157.94	HAIKYUFH	175	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.801	2025-11-19 12:51:08.801	bce19e7a-e761-493c-93ba-092ef32537fc
10193be7-fbc6-40ee-ab9e-bbb6f8790a9a	0	529 525 บาท ได้รับ 980 Star Gems	525.00	525.00	525.00	473.81	HAIKYUFH	525	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.888	2025-11-19 12:51:08.888	bce19e7a-e761-493c-93ba-092ef32537fc
7bc0f854-d272-4ab5-bb4a-66cff33083d8	0	1,050 บาท ได้รับ 1,980 Star Gems	1050.00	1050.00	1050.00	947.63	HAIKYUFH	1050	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:08.978	2025-11-19 12:51:08.978	bce19e7a-e761-493c-93ba-092ef32537fc
f0ae3a08-1569-42c0-be5a-93060d3ac106	0	1,830 1,750 บาท ได้รับ 3,280 Star Gems	1750.00	1750.00	1750.00	1579.38	HAIKYUFH	1750	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:09.066	2025-11-19 12:51:09.066	bce19e7a-e761-493c-93ba-092ef32537fc
79b4eb67-ffd4-4d49-bf7f-dd986dcb9fcc	0	3,590 3,400 บาท ได้รับ 6,480 Star Gems	3400.00	3400.00	3400.00	3068.50	HAIKYUFH	3400	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:09.153	2025-11-19 12:51:09.153	bce19e7a-e761-493c-93ba-092ef32537fc
6ae223bc-4cc1-4c03-ae36-37b9d3dc8bb7	0	หีบเสบียง Zeny 2 เท่าเล็กน้อย 350 บาท	350.02	350.02	350.02	306.27	RO-M-CSC	350.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:09.596	2025-11-19 12:51:09.596	5795348b-5b69-447a-9294-c429af683862
b9a0b36d-f032-4164-8483-e05d455272ab	0	หีบเสบียง Zeny 2 เท่าใหญ่ 1050 บาท	1050.02	1050.02	1050.02	918.77	RO-M-CSC	1050.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:09.684	2025-11-19 12:51:09.684	5795348b-5b69-447a-9294-c429af683862
2f339484-71d4-431b-8b60-41db9759df85	0	Kafra - Upgrade Adventure Log 235 บาท	235.02	235.02	235.02	205.64	RO-M-CSC	235.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:09.771	2025-11-19 12:51:09.771	5795348b-5b69-447a-9294-c429af683862
ada7090f-ff6d-458a-ba00-35cf27eb7713	0	Kafra - Collection Adventure Log 800 บาท	800.02	800.02	800.02	700.02	RO-M-CSC	800.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:09.859	2025-11-19 12:51:09.859	5795348b-5b69-447a-9294-c429af683862
d8008a1e-b33b-44d2-861c-16751a46dad9	0	102 บาท ได้รับ 1,800,000 Zeny	102.00	102.00	102.00	89.25	RO-M-CSC	102	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:09.949	2025-11-19 12:51:09.949	5795348b-5b69-447a-9294-c429af683862
a75d56da-53ad-49d0-b17b-784dfb4c6127	0	170 บาท ได้รับ 3,060,000 Zeny	170.00	170.00	170.00	148.75	RO-M-CSC	170	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:10.041	2025-11-19 12:51:10.041	5795348b-5b69-447a-9294-c429af683862
d6e4be56-c894-450f-b024-596ee0955919	0	350 บาท ได้รับ 7,072,000 Zeny	350.00	350.00	350.00	306.25	RO-M-CSC	350	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:10.13	2025-11-19 12:51:10.13	5795348b-5b69-447a-9294-c429af683862
7d684649-43c3-4373-b1cb-5848bfb80b82	0	600 บาท ได้รับ 13,568,000 Zeny	600.00	600.00	600.00	525.00	RO-M-CSC	600	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:10.218	2025-11-19 12:51:10.218	5795348b-5b69-447a-9294-c429af683862
17aaf77a-3d42-4b03-8c99-84cd206684c9	0	1,530 บาท ได้รับ 35,500,000 Zeny	1530.00	1530.00	1530.00	1338.75	RO-M-CSC	1530	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:10.306	2025-11-19 12:51:10.306	5795348b-5b69-447a-9294-c429af683862
6984e3a2-80c4-427a-b31a-db2035fc8c90	0	2,995 บาท ได้รับ 72,000,000 Zeny	2995.00	2995.00	2995.00	2620.63	RO-M-CSC	2995	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:10.394	2025-11-19 12:51:10.394	5795348b-5b69-447a-9294-c429af683862
8ed2ac33-ca4a-4d48-b0bc-33602caf2b07	0	Aurum Pass 30 วัน 199 บาท	199.02	199.02	199.02	181.11	LDSPACE	199.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:10.834	2025-11-19 12:51:10.834	471260d5-d4a1-400f-8c6b-6d117a211c2a
2019cd25-fd72-417c-9c29-61b842d60779	0	Companionship Pack 699 บาท	699.02	699.02	699.02	636.11	LDSPACE	699.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:10.922	2025-11-19 12:51:10.922	471260d5-d4a1-400f-8c6b-6d117a211c2a
38be608f-17a9-4061-a906-47e1d5078f6c	0	29 บาท ได้รับ 60 Crystals	29.00	29.00	29.00	26.39	LDSPACE	29	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.008	2025-11-19 12:51:11.008	471260d5-d4a1-400f-8c6b-6d117a211c2a
15a08dca-80a4-414f-a408-bc4e31279f68	0	199 บาท ได้รับ 300 Crystals+30 Diamonds	199.00	199.00	199.00	181.09	LDSPACE	199	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.095	2025-11-19 12:51:11.095	471260d5-d4a1-400f-8c6b-6d117a211c2a
b63e0825-0546-4598-bf32-bb73568c8c1a	0	249 บาท ได้รับ 450 Crystals+90 Diamonds	249.00	249.00	249.00	226.59	LDSPACE	249	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.183	2025-11-19 12:51:11.183	471260d5-d4a1-400f-8c6b-6d117a211c2a
9ad2b0a1-a291-49bb-afa3-817010351a20	0	499 บาท ได้รับ 980 Crystals+150 Diamonds	499.00	499.00	499.00	454.09	LDSPACE	499	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.274	2025-11-19 12:51:11.274	471260d5-d4a1-400f-8c6b-6d117a211c2a
aae14dc6-8ebc-44f3-917a-d4461825cc83	0	999 บาท ได้รับ 1980 Crystals+360 Diamonds	999.00	999.00	999.00	909.09	LDSPACE	999	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.369	2025-11-19 12:51:11.369	471260d5-d4a1-400f-8c6b-6d117a211c2a
4369f6d1-8a90-41fe-860b-83a2d260ee38	0	1,990 บาท ได้รับ 3280 Crystals+720 Diamonds	1990.00	1990.00	1990.00	1810.90	LDSPACE	1990	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.461	2025-11-19 12:51:11.461	471260d5-d4a1-400f-8c6b-6d117a211c2a
f6910b3e-0744-464e-8bd5-88ac7f61c1d1	0	3,990 บาท ได้รับ 6480 Crystals+1600 Diamonds	3990.00	3990.00	3990.00	3630.90	LDSPACE	3990	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.55	2025-11-19 12:51:11.55	471260d5-d4a1-400f-8c6b-6d117a211c2a
9c442d24-3df6-4dc5-a9b7-e094c1cc8dce	0	Esperia Monthly - Classic Gazette 179 บาท	179.02	179.02	179.02	170.07	AFKJOURNEY	179.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:11.995	2025-11-19 12:51:11.995	e5640d93-6ef6-41d4-9499-d076b2703d48
601d8f9f-71b0-4a03-98a8-9f9ebee5a5f0	0	Esperia Monthly - Premium Gazette 549 บาท	549.02	549.02	549.02	521.57	AFKJOURNEY	549.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.083	2025-11-19 12:51:12.083	e5640d93-6ef6-41d4-9499-d076b2703d48
09cc0378-d3b7-44b5-b0ef-464e00888e29	0	Growth Bundle 1,100 บาท	1100.02	1100.02	1100.02	1045.02	AFKJOURNEY	1100.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.17	2025-11-19 12:51:12.17	e5640d93-6ef6-41d4-9499-d076b2703d48
601f596e-0408-4fb2-bf48-e4e114b6cd05	0	35 บาทได้รับ 21 Dragon Crystals	35.00	35.00	35.00	33.25	AFKJOURNEY	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.258	2025-11-19 12:51:12.258	e5640d93-6ef6-41d4-9499-d076b2703d48
9b6c622c-b15f-4910-9f42-db7f574ea8ef	0	179 บาทได้รับ 126 Dragon Crystals	179.00	179.00	179.00	170.05	AFKJOURNEY	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.345	2025-11-19 12:51:12.345	e5640d93-6ef6-41d4-9499-d076b2703d48
38bc57ef-be71-490c-b95b-c7c7d6fd83ab	0	349 บาทได้รับ 294 Dragon Crystals	349.00	349.00	349.00	331.55	AFKJOURNEY	349	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.432	2025-11-19 12:51:12.432	e5640d93-6ef6-41d4-9499-d076b2703d48
6718a38b-e826-4587-965e-6a77c72806dd	0	729 บาทได้รับ 588 Dragon Crystals	729.00	729.00	729.00	692.55	AFKJOURNEY	729	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.52	2025-11-19 12:51:12.52	e5640d93-6ef6-41d4-9499-d076b2703d48
f8a279ba-6b56-4a9a-9d6b-57fe8faab475	0	1,800 บาทได้รับ 1,554 Dragon Crystals	1800.00	1800.00	1800.00	1710.00	AFKJOURNEY	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.607	2025-11-19 12:51:12.607	e5640d93-6ef6-41d4-9499-d076b2703d48
87430d98-0600-4150-bf4e-73aea02270c2	0	3,700 บาทได้รับ 3,150 Dragon Crystals	3700.00	3700.00	3700.00	3515.00	AFKJOURNEY	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:12.694	2025-11-19 12:51:12.694	e5640d93-6ef6-41d4-9499-d076b2703d48
e2480127-81f9-4b9b-a878-6adbe3d64afa	0	บัตรเดือนสุดคุ้ม 150 บาท	150.02	150.02	150.02	142.52	METALSLUG	150.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.135	2025-11-19 12:51:13.135	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
52061034-f22b-44ef-9786-11897aaa1243	0	บัตรเดือนหรูหรา 300 บาท	300.02	300.02	300.02	285.02	METALSLUG	300.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.222	2025-11-19 12:51:13.222	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
0203ad02-72ff-4cb0-aa5d-109b9ebedfd5	0	30 บาทได้รับ 60 อัญมณีแดง	30.00	30.00	30.00	28.50	METALSLUG	30	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.309	2025-11-19 12:51:13.309	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
f387ed78-b112-46d6-a290-10db090621e9	0	150 บาทได้รับ 310 อัญมณีแดง	150.00	150.00	150.00	142.50	METALSLUG	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.397	2025-11-19 12:51:13.397	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
c28cb4c7-9ea0-45d5-9e13-cfd9e3d876d9	0	300 บาทได้รับ 630 อัญมณีแดง	300.00	300.00	300.00	285.00	METALSLUG	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.485	2025-11-19 12:51:13.485	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
8b5bae08-735e-4d7a-b017-f27dbdb6b993	0	600 บาทได้รับ 1,300 อัญมณีแดง	600.00	600.00	600.00	570.00	METALSLUG	600	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.572	2025-11-19 12:51:13.572	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
8b732bd9-dc37-484f-a8ef-67336be63104	0	1,500 บาทได้รับ 3,200 อัญมณีแดง	1500.00	1500.00	1500.00	1425.00	METALSLUG	1500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.658	2025-11-19 12:51:13.658	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
ec512893-d4c9-4a28-a4ed-97210318d49c	0	3,000 บาทได้รับ 6,500 อัญมณีแดง	3000.00	3000.00	3000.00	2850.00	METALSLUG	3000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:13.746	2025-11-19 12:51:13.746	dfd2eb34-346b-491b-b05e-0ed9ff07de7c
4ec99285-8af5-4edd-a141-777175a06e11	0	39 บาทได้รับ 66 Bonds	39.00	39.00	39.00	29.25	ARENABO	39	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:14.194	2025-11-19 12:51:14.194	9e793feb-ba5f-4842-8dcf-54e4111a131a
915bb1f4-7e6d-4547-af75-62c3ae20b347	0	189 บาทได้รับ 335 Bonds	189.00	189.00	189.00	141.75	ARENABO	189	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:14.28	2025-11-19 12:51:14.28	9e793feb-ba5f-4842-8dcf-54e4111a131a
3574dec1-fd79-4082-8306-9f35bd2db38d	0	375 บาทได้รับ 675 Bonds	375.00	375.00	375.00	281.25	ARENABO	375	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:14.369	2025-11-19 12:51:14.369	9e793feb-ba5f-4842-8dcf-54e4111a131a
f2d59f7c-6bc8-4d08-a218-d0f83b453d6a	0	939 บาทได้รับ 1,690 Bonds	939.00	939.00	939.00	704.25	ARENABO	939	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:14.456	2025-11-19 12:51:14.456	9e793feb-ba5f-4842-8dcf-54e4111a131a
aac8d752-07a4-48cd-9a3b-f0e36bfc8354	0	1,870 บาทได้รับ 3,400 Bonds	1870.00	1870.00	1870.00	1402.50	ARENABO	1870	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:14.586	2025-11-19 12:51:14.586	9e793feb-ba5f-4842-8dcf-54e4111a131a
f7188160-633a-4dc4-b851-11ca91a1094b	0	3,750 บาทได้รับ 6,820 Bonds	3750.00	3750.00	3750.00	2812.50	ARENABO	3750	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:14.673	2025-11-19 12:51:14.673	9e793feb-ba5f-4842-8dcf-54e4111a131a
4fc0e0b6-1537-4150-90f4-dacc9eb3bef1	0	พรแห่งดวงจันทร์ 179 บาท- รับทันที 300 Genesis Crystals- รับวันละ 90 Primogem เมื่อเข้าสู่เกม	179.01	179.01	179.01	136.05	GENSHIN	179.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:15.647	2025-11-19 12:51:15.647	2fd884b4-33e3-412b-bc25-4deb754ca5d7
93e4eea0-710a-4b4a-a400-c1c3dc1553bf	0	35 บาท ได้รับ 60 Genesis Crystals	35.00	35.00	35.00	26.60	GENSHIN	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:15.734	2025-11-19 12:51:15.734	2fd884b4-33e3-412b-bc25-4deb754ca5d7
1dccc1b7-4ae6-4cd8-b02a-52c96e6aeee3	0	179 บาท ได้รับ 330 Genesis Crystals	179.00	179.00	179.00	136.04	GENSHIN	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:15.821	2025-11-19 12:51:15.821	2fd884b4-33e3-412b-bc25-4deb754ca5d7
9e3389af-5446-4fcb-b917-92967e679bb1	0	549 บาท ได้รับ 1,090 Genesis Crystals	549.00	549.00	549.00	417.24	GENSHIN	549	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:15.909	2025-11-19 12:51:15.909	2fd884b4-33e3-412b-bc25-4deb754ca5d7
1679c158-0235-4283-8b11-0a52d95a5760	0	1,800 บาท ได้รับ 3,880 Genesis Crystals	1800.00	1800.00	1800.00	1368.00	GENSHIN	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:15.995	2025-11-19 12:51:15.995	2fd884b4-33e3-412b-bc25-4deb754ca5d7
26d2f820-db84-427a-9029-ab33046f5b02	0	3,700 บาท ได้รับ 8,080 Genesis Crystals	3700.00	3700.00	3700.00	2812.00	GENSHIN	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:16.083	2025-11-19 12:51:16.083	2fd884b4-33e3-412b-bc25-4deb754ca5d7
f4bdbe40-cf62-431e-b699-a518f45f8018	0	Inter-Knot Membership 179 บาท- รับทันที 300 Monochrome- รับวันละ 90 Polychrome เมื่อเข้าสู่เกม	179.01	179.01	179.01	136.05	ZZZERO	179.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:16.92	2025-11-19 12:51:16.92	a11e672b-a912-4b14-acbf-e6cb9794fa8e
8cf48295-beb6-4596-b6d0-ebd441df9dba	0	179 บาท ได้รับ 330 Monochrome	179.00	179.00	179.00	136.04	ZZZERO	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:17.008	2025-11-19 12:51:17.008	a11e672b-a912-4b14-acbf-e6cb9794fa8e
16e8ab1b-a488-4391-9c68-6f8808815a5b	0	549 บาท ได้รับ 1,090 Monochrome	549.00	549.00	549.00	417.24	ZZZERO	549	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:17.095	2025-11-19 12:51:17.095	a11e672b-a912-4b14-acbf-e6cb9794fa8e
674c178b-bc22-4f23-8b46-732ea1dcd288	0	1,800 บาท ได้รับ 3,880 Monochrome	1800.00	1800.00	1800.00	1368.00	ZZZERO	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:17.182	2025-11-19 12:51:17.182	a11e672b-a912-4b14-acbf-e6cb9794fa8e
c1dd87b4-94a3-4a46-951e-844811f4c682	0	3,700 บาท ได้รับ 8,080 Monochrome	3700.00	3700.00	3700.00	2812.00	ZZZERO	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:17.27	2025-11-19 12:51:17.27	a11e672b-a912-4b14-acbf-e6cb9794fa8e
7819634e-1dcc-47da-bf32-54e858ff2bc4	0	Express Supply Pass 179 บาท- รับทันที 300 Oneiric Shard- รับวันละ 90 Stellar Jades เมื่อเข้าสู่เกม	179.01	179.01	179.01	136.05	HONKAISR	179.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:18.103	2025-11-19 12:51:18.103	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
26935e74-8046-42b7-8a3e-74ea77ee90a3	0	179 บาท ได้รับ 330 Oneiric Shard	179.00	179.00	179.00	136.04	HONKAISR	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:18.191	2025-11-19 12:51:18.191	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
d462b7b4-3e63-4b2c-8637-fb210bb0a4af	0	549 บาท ได้รับ 1,090 Oneiric Shard	549.00	549.00	549.00	417.24	HONKAISR	549	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:18.278	2025-11-19 12:51:18.278	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
b82069b1-3bbb-4fd9-a2e2-baaa1343db30	0	1,800 บาท ได้รับ 3,880 Oneiric Shard	1800.00	1800.00	1800.00	1368.00	HONKAISR	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:18.365	2025-11-19 12:51:18.365	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
10622f31-e8f6-42d3-84b1-4da39dcc8030	0	3,700 บาท ได้รับ 8,080 Oneiric Shard	3700.00	3700.00	3700.00	2812.00	HONKAISR	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:18.452	2025-11-19 12:51:18.452	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
38d717d9-6548-4990-8fda-370921b27f74	0	35 บาทได้รับ 626 Gems	35.00	35.00	35.00	26.25	DRAGONN-MC	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:18.894	2025-11-19 12:51:18.894	9e083cc1-4fd1-4376-ad9b-9af2be776c02
48e6c286-e758-454f-bdbb-76517a4bd835	0	190 บาทได้รับ 3,130 Gems	190.00	190.00	190.00	142.50	DRAGONN-MC	190	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:18.982	2025-11-19 12:51:18.982	9e083cc1-4fd1-4376-ad9b-9af2be776c02
481e853f-52a9-45f4-b6ce-3702d8810f26	0	380 บาทได้รับ 6,366 Gems	380.00	380.00	380.00	285.00	DRAGONN-MC	380	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.073	2025-11-19 12:51:19.073	9e083cc1-4fd1-4376-ad9b-9af2be776c02
676507ae-fe20-492d-b39b-c8844c672938	0	750 บาทได้รับ 12,800 Gems	750.00	750.00	750.00	562.50	DRAGONN-MC	750	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.16	2025-11-19 12:51:19.16	9e083cc1-4fd1-4376-ad9b-9af2be776c02
a401c5b2-6945-488e-b188-93eb5cbf2afe	0	1,170 บาทได้รับ 19,500 Gems	1170.00	1170.00	1170.00	877.50	DRAGONN-MC	1170	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.248	2025-11-19 12:51:19.248	9e083cc1-4fd1-4376-ad9b-9af2be776c02
f2d48225-6198-41bf-8bc0-13e90852ea5e	0	1,950 บาทได้รับ 32,900 Gems	1950.00	1950.00	1950.00	1462.50	DRAGONN-MC	1950	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.337	2025-11-19 12:51:19.337	9e083cc1-4fd1-4376-ad9b-9af2be776c02
2029c5e6-ea78-4f20-92b4-c956e01650eb	0	3,900 บาทได้รับ 66,000 Gems	3900.00	3900.00	3900.00	2925.00	DRAGONN-MC	3900	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.425	2025-11-19 12:51:19.425	9e083cc1-4fd1-4376-ad9b-9af2be776c02
a3fa7fee-ced2-447d-893c-8893e959237a	0	7,700 บาทได้รับ 132,000 Gems	7700.00	7700.00	7700.00	5775.00	DRAGONN-MC	7700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.512	2025-11-19 12:51:19.512	9e083cc1-4fd1-4376-ad9b-9af2be776c02
8e62b5ec-6b03-4623-8d5f-6a46aab88397	0	11,400 บาทได้รับ 198,000 Gems	11400.00	11400.00	11400.00	8550.00	DRAGONN-MC	11400	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.599	2025-11-19 12:51:19.599	9e083cc1-4fd1-4376-ad9b-9af2be776c02
541169cf-8c43-456f-9aae-81624f92ad41	0	15,100 บาทได้รับ 264,000 Gems	15100.00	15100.00	15100.00	11325.00	DRAGONN-MC	15100	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.687	2025-11-19 12:51:19.687	9e083cc1-4fd1-4376-ad9b-9af2be776c02
31fe6f8c-e15e-4827-8621-11d5fc1a232d	0	18,500 บาทได้รับ 330,000 Gems	18500.00	18500.00	18500.00	13875.00	DRAGONN-MC	18500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:19.775	2025-11-19 12:51:19.775	9e083cc1-4fd1-4376-ad9b-9af2be776c02
ab6c230a-e70f-413e-95c5-0fd88647029a	0	350 บาทได้รับ 10 เพชรสี	350.00	350.00	350.00	329.00	MPS-RE	350	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:37.878	2025-11-19 12:51:37.878	7dbb577d-1103-4840-9d57-d9751760be9f
2e3caa9a-59fc-45ec-9f4a-073e227a5f53	0	700 บาทได้รับ 21 เพชรสี	700.00	700.00	700.00	658.00	MPS-RE	700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:37.967	2025-11-19 12:51:37.967	7dbb577d-1103-4840-9d57-d9751760be9f
64ebd941-318e-4ec4-95d4-9ba832cbfa9c	0	1,000 บาทได้รับ 30 เพชรสี	1000.00	1000.00	1000.00	940.00	MPS-RE	1000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:38.055	2025-11-19 12:51:38.055	7dbb577d-1103-4840-9d57-d9751760be9f
c1645200-7d23-4d57-a856-bfdb518a14c4	0	3,000 บาทได้รับ 89 เพชรสี	3000.00	3000.00	3000.00	2820.00	MPS-RE	3000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:38.143	2025-11-19 12:51:38.143	7dbb577d-1103-4840-9d57-d9751760be9f
1e501724-c8cb-4832-ab67-5aef8c1a7e14	0	5,000 บาทได้รับ 148 เพชรสี	5000.00	5000.00	5000.00	4700.00	MPS-RE	5000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:38.231	2025-11-19 12:51:38.231	7dbb577d-1103-4840-9d57-d9751760be9f
35546868-eea7-4f48-8433-dd8633db3025	0	8,000 บาทได้รับ 237 เพชรสี	8000.00	8000.00	8000.00	7520.00	MPS-RE	8000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:38.318	2025-11-19 12:51:38.318	7dbb577d-1103-4840-9d57-d9751760be9f
54af5bc7-2d2d-4697-8e71-1c0791c89f0f	0	10,000 บาทได้รับ 297 เพชรสี	10000.00	10000.00	10000.00	9400.00	MPS-RE	10000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:38.406	2025-11-19 12:51:38.406	7dbb577d-1103-4840-9d57-d9751760be9f
d14d06af-a3b2-419e-83ed-5713b1eb0b61	0	20,000 บาทได้รับ 593 เพชรสี	20000.00	20000.00	20000.00	18800.00	MPS-RE	20000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:38.493	2025-11-19 12:51:38.493	7dbb577d-1103-4840-9d57-d9751760be9f
55d65183-5811-46da-955e-1f146cecb100	0	คูปองเสบียงรายสัปดาห์ 79 บาท	79.00	79.00	79.00	74.85	UNDAWN	79	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:38.979	2025-11-19 12:51:38.979	58074e91-dca8-4d5f-ab17-0089410db139
781609a1-5571-4115-9506-ad0cfa312670	0	คูปองเสบียงรายเดือน 129 บาท	129.00	129.00	129.00	122.23	UNDAWN	129	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.067	2025-11-19 12:51:39.067	58074e91-dca8-4d5f-ab17-0089410db139
a1e5fe0d-64c0-4ec8-b37b-16b6629a93d5	0	แพ็กเตรียมรบ 239 บาท	239.00	239.00	239.00	226.45	UNDAWN	239	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.155	2025-11-19 12:51:39.155	58074e91-dca8-4d5f-ab17-0089410db139
dba5b58f-d998-43e3-bae7-23494b3f8aa2	0	กองทุนเติบโต 269 บาท	269.00	269.00	269.00	254.88	UNDAWN	269	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.242	2025-11-19 12:51:39.242	58074e91-dca8-4d5f-ab17-0089410db139
a93fbe46-f020-4ffb-b61c-6aff4861ad15	0	กองทุนอีลีต 349 บาท	349.00	349.00	349.00	330.68	UNDAWN	349	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.33	2025-11-19 12:51:39.33	58074e91-dca8-4d5f-ab17-0089410db139
955f96c5-cdce-402e-8863-c8b5223ec894	0	Advanced Glory Pass 379 บาท	379.00	379.00	379.00	359.10	UNDAWN	379	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.417	2025-11-19 12:51:39.417	58074e91-dca8-4d5f-ab17-0089410db139
654035db-7c6c-47cf-8a35-56980568714b	0	Ace Fund 379 บาท	379.02	379.02	379.02	359.12	UNDAWN	379.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.505	2025-11-19 12:51:39.505	58074e91-dca8-4d5f-ab17-0089410db139
4f166137-2f4a-4190-8d65-6fb22174e6c1	0	20 บาท ได้รับ 55 RC	20.00	20.00	20.00	18.95	UNDAWN	20	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.592	2025-11-19 12:51:39.592	58074e91-dca8-4d5f-ab17-0089410db139
c3a440ee-b277-4e1b-86e5-a8a37097666f	0	50 บาท ได้รับ 138 RC	50.00	50.00	50.00	47.38	UNDAWN	50	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.68	2025-11-19 12:51:39.68	58074e91-dca8-4d5f-ab17-0089410db139
224ab014-7cdf-4ac6-ad3e-039d65a54b56	0	90 บาท ได้รับ 253 RC	90.00	90.00	90.00	85.28	UNDAWN	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.769	2025-11-19 12:51:39.769	58074e91-dca8-4d5f-ab17-0089410db139
e9a02140-c301-4474-95e8-8bab64a0aaca	0	150 บาท ได้รับ 440 RC	150.00	150.00	150.00	142.13	UNDAWN	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.857	2025-11-19 12:51:39.857	58074e91-dca8-4d5f-ab17-0089410db139
0bbb3369-46cf-4f34-b9c2-8a8eb4fef757	0	300 บาท ได้รับ 880 RC	300.00	300.00	300.00	284.25	UNDAWN	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:39.946	2025-11-19 12:51:39.946	58074e91-dca8-4d5f-ab17-0089410db139
362c156b-7a41-44ce-9866-094ff63b981f	0	500 บาท ได้รับ 1,485 RC	500.00	500.00	500.00	473.75	UNDAWN	500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:40.033	2025-11-19 12:51:40.033	58074e91-dca8-4d5f-ab17-0089410db139
c0b0e277-d3ad-49bf-9619-faa445915565	0	1,000 บาท ได้รับ 2,970 RC	1000.00	1000.00	1000.00	947.50	UNDAWN	1000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:40.122	2025-11-19 12:51:40.122	58074e91-dca8-4d5f-ab17-0089410db139
82f2d3b7-bfe9-47f7-8e8a-ee8440f98470	0	1,500 บาท ได้รับ 4,510 RC	1500.00	1500.00	1500.00	1421.25	UNDAWN	1500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:40.211	2025-11-19 12:51:40.211	58074e91-dca8-4d5f-ab17-0089410db139
e306f9e5-cc87-42a8-bec0-894a2311c7d3	0	2,000 บาท ได้รับ 6,050 RC	2000.00	2000.00	2000.00	1895.00	UNDAWN	2000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:40.3	2025-11-19 12:51:40.3	58074e91-dca8-4d5f-ab17-0089410db139
425d7abb-9a7d-44fc-9e1a-a6d074f2bc1b	0	3,000 บาท ได้รับ 9,218 RC	3000.00	3000.00	3000.00	2842.50	UNDAWN	3000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:40.388	2025-11-19 12:51:40.388	58074e91-dca8-4d5f-ab17-0089410db139
f052efa1-2a65-4d33-8e2f-1f5d64962f91	0	5,000 บาท ได้รับ 15,642 RC	5000.00	5000.00	5000.00	4737.50	UNDAWN	5000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:40.477	2025-11-19 12:51:40.477	58074e91-dca8-4d5f-ab17-0089410db139
38c3b738-6fc6-40ad-97b9-6c3a77805410	0	15 บาท ได้รับ 40 FC POINTS	15.00	15.00	15.00	13.88	FIFA-M	15	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:40.921	2025-11-19 12:51:40.921	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
b5224f90-17e4-4608-8ad1-c4de74bd0eee	0	35 บาท ได้รับ 100 FC POINTS	35.00	35.00	35.00	32.38	FIFA-M	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.009	2025-11-19 12:51:41.009	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
114e5316-288f-4d28-b6cb-148ba3123f19	0	179 บาท ได้รับ 520 FC POINTS	179.00	179.00	179.00	165.58	FIFA-M	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.097	2025-11-19 12:51:41.097	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
56e963cc-812b-48bd-9496-408fc18f02a4	0	349 บาท ได้รับ 1,070 FC POINTS	349.00	349.00	349.00	322.83	FIFA-M	349	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.184	2025-11-19 12:51:41.184	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
9532e6a7-0dfa-46a0-ad88-d246c426d564	0	729 บาท ได้รับ 2,200 FC POINTS	729.00	729.00	729.00	674.33	FIFA-M	729	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.271	2025-11-19 12:51:41.271	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
b9852f6f-5415-449a-afc4-5fa62c928f05	0	1,800 บาท ได้รับ 5,750 FC POINTS	1800.00	1800.00	1800.00	1665.00	FIFA-M	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.359	2025-11-19 12:51:41.359	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
29769a4d-119b-4f11-b7c5-2cae092afddb	0	3,700 บาท ได้รับ 12,000 FC POINTS	3700.00	3700.00	3700.00	3422.50	FIFA-M	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.446	2025-11-19 12:51:41.446	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
19bfa609-75fd-4e4c-92d8-9b01e8bad247	0	15 บาท ได้รับ 39 FC SILVER	15.01	15.01	15.01	13.88	FIFA-M	15.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.533	2025-11-19 12:51:41.533	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
58810652-ef28-4530-8d1d-4538d7454c63	0	35 บาท ได้รับ 99 FC SILVER	35.01	35.01	35.01	32.38	FIFA-M	35.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.621	2025-11-19 12:51:41.621	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
b73c8518-c26c-491d-a61b-36de186411ae	0	179 บาท ได้รับ 499 FC SILVER	179.01	179.01	179.01	165.58	FIFA-M	179.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.71	2025-11-19 12:51:41.71	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
372c415c-df2f-4a75-b1ee-383aeb191c0d	0	349 บาท ได้รับ 999 FC SILVER	349.01	349.01	349.01	322.83	FIFA-M	349.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.798	2025-11-19 12:51:41.798	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
1c6187f0-b775-4949-86f9-30384801c59b	0	729 บาท ได้รับ 1,999 FC SILVER	729.01	729.01	729.01	674.33	FIFA-M	729.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.886	2025-11-19 12:51:41.886	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
271b45f6-391a-482f-ac2d-44d8d7f06933	0	1,800 บาท ได้รับ 4,999 FC SILVER	1800.01	1800.01	1800.01	1665.01	FIFA-M	1800.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:41.978	2025-11-19 12:51:41.978	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
e1725c05-3ffd-4079-a528-61649af6445c	0	3,700 บาท ได้รับ 9,999 FC SILVER	3700.01	3700.01	3700.01	3422.51	FIFA-M	3700.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:42.066	2025-11-19 12:51:42.066	6cd6b7db-c5df-4666-b9ef-51b0c0cb886b
6cb1a319-e1c1-4eee-a897-faa5e46cb292	0	20 บาท ได้รับ 7 ZEMS	20.00	20.00	20.00	11.20	ZEPETO	20	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:42.511	2025-11-19 12:51:42.511	1a80fdd4-b126-4d05-bc44-2f2fef25981c
ddf9ef7d-08e0-4e9c-8156-7ae460a6046e	0	40 บาท ได้รับ 14 ZEMS	40.00	40.00	40.00	22.40	ZEPETO	40	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:42.6	2025-11-19 12:51:42.6	1a80fdd4-b126-4d05-bc44-2f2fef25981c
1b176e61-b3cd-4922-889f-d03ac5ca23a9	0	78 บาท ได้รับ 28 ZEMS	78.00	78.00	78.00	43.68	ZEPETO	78	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:42.688	2025-11-19 12:51:42.688	1a80fdd4-b126-4d05-bc44-2f2fef25981c
7729459e-f4ae-403d-956e-c6034f3b26a2	0	155 บาท ได้รับ 58 ZEMS	155.00	155.00	155.00	86.80	ZEPETO	155	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:42.776	2025-11-19 12:51:42.776	1a80fdd4-b126-4d05-bc44-2f2fef25981c
b1638a35-9770-497e-a776-9c24d45c44af	0	339 บาท ได้รับ 128 ZEMS	339.00	339.00	339.00	189.84	ZEPETO	339	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:42.864	2025-11-19 12:51:42.864	1a80fdd4-b126-4d05-bc44-2f2fef25981c
d7664e0d-39ac-491e-80a9-72a5b5d2ccc5	0	854 บาท ได้รับ 323 ZEMS	854.00	854.00	854.00	478.24	ZEPETO	854	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:42.952	2025-11-19 12:51:42.952	1a80fdd4-b126-4d05-bc44-2f2fef25981c
f33b9006-c14b-4984-acd5-4de953af55b9	0	2556 บาท ได้รับ 1000 ZEMS	2556.00	2556.00	2556.00	1431.36	ZEPETO	2556	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:43.042	2025-11-19 12:51:43.042	1a80fdd4-b126-4d05-bc44-2f2fef25981c
2b05b600-d23f-4f57-aab9-fbceb5fec709	0	40 บาท ได้รับ 4,680 COINS	40.01	40.01	40.01	22.41	ZEPETO	40.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:43.131	2025-11-19 12:51:43.131	1a80fdd4-b126-4d05-bc44-2f2fef25981c
999befbf-d1ec-4531-bd84-6043310eeb44	0	78 บาท ได้รับ 9,600 COINS	78.01	78.01	78.01	43.69	ZEPETO	78.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:43.22	2025-11-19 12:51:43.22	1a80fdd4-b126-4d05-bc44-2f2fef25981c
bf29bb1e-00e7-4ee0-8649-624713b742c9	0	194 บาท ได้รับ 25,200 COINS	194.01	194.01	194.01	108.65	ZEPETO	194.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:43.309	2025-11-19 12:51:43.309	1a80fdd4-b126-4d05-bc44-2f2fef25981c
ba10b556-150a-4845-8f80-8f96b65dda5b	0	310 บาท ได้รับ 40,700 COINS	310.01	310.01	310.01	173.61	ZEPETO	310.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:43.397	2025-11-19 12:51:43.397	1a80fdd4-b126-4d05-bc44-2f2fef25981c
b2516e3f-d13a-47ad-a963-0a76b296eebb	0	825 บาท ได้รับ 110,000 COINS	825.01	825.01	825.01	462.01	ZEPETO	825.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:43.485	2025-11-19 12:51:43.485	1a80fdd4-b126-4d05-bc44-2f2fef25981c
77d80914-ebce-4b50-815f-e308dd175e8c	0	2204 บาท ได้รับ 300,000 COINS	2204.01	2204.01	2204.01	1234.25	ZEPETO	2204.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:43.573	2025-11-19 12:51:43.573	1a80fdd4-b126-4d05-bc44-2f2fef25981c
619af130-0f60-4708-8e01-2e8efda2c0f1	0	0 บาท	0.00	0.00	0.00	0.00	DIABLO-IV	0	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:44.019	2025-11-19 12:51:44.019	e8365673-59d2-49b5-b573-6dfec1af65e6
ae438545-f8eb-42b2-aab9-a99bffd2ccd3	0	130 บาท ได้รับ 575 TFT Coins	130.00	130.00	130.00	123.50	TFTACTICS	130	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:44.462	2025-11-19 12:51:44.462	3c3f4ac9-718f-44b8-b240-9ed406c591af
2b7a4da5-d9ec-4ab8-b855-3ba6c142ce54	0	290 บาท ได้รับ 1380 TFT Coins	290.00	290.00	290.00	275.50	TFTACTICS	290	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:44.549	2025-11-19 12:51:44.549	3c3f4ac9-718f-44b8-b240-9ed406c591af
385ac55b-0f9c-4c0a-ab85-be63550fc9ad	0	560 บาท ได้รับ 2800 TFT Coins	560.00	560.00	560.00	532.00	TFTACTICS	560	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:44.638	2025-11-19 12:51:44.638	3c3f4ac9-718f-44b8-b240-9ed406c591af
780734af-f09c-4f07-875d-a30b7accd1c8	0	890 บาท ได้รับ 4500 TFT Coins	890.00	890.00	890.00	845.50	TFTACTICS	890	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:44.767	2025-11-19 12:51:44.767	3c3f4ac9-718f-44b8-b240-9ed406c591af
8544c47b-2dad-4ced-9c8f-066e9a4d2b7c	0	1,250 บาท ได้รับ 6500 TFT Coins	1250.00	1250.00	1250.00	1187.50	TFTACTICS	1250	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:44.856	2025-11-19 12:51:44.856	3c3f4ac9-718f-44b8-b240-9ed406c591af
5172a986-28dd-4677-a3db-b360d47e9da6	0	2,550 บาท ได้รับ 13500 TFT Coins	2550.00	2550.00	2550.00	2422.50	TFTACTICS	2550	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:44.945	2025-11-19 12:51:44.945	3c3f4ac9-718f-44b8-b240-9ed406c591af
cd742026-f601-4e5d-a932-e76a81fab65f	0	35 บาท ได้รับ 40 Nyan Berry	35.00	35.00	35.00	30.45	ROO	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:45.39	2025-11-19 12:51:45.39	6344984c-c24a-41d5-a3cc-603fd1224b0e
28f87043-2e64-47ba-b53a-21b126058ad9	0	99 บาท ได้รับ 125 Nyan Berry	99.00	99.00	99.00	86.13	ROO	99	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:45.478	2025-11-19 12:51:45.478	6344984c-c24a-41d5-a3cc-603fd1224b0e
bd4289a6-9ffa-4e1f-9617-1084c2b969f1	0	165 บาท ได้รับ 210 Nyan Berry	165.00	165.00	165.00	143.55	ROO	165	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:45.565	2025-11-19 12:51:45.565	6344984c-c24a-41d5-a3cc-603fd1224b0e
f9fad3aa-1995-417d-8284-d94b2b82f149	0	330 บาท ได้รับ 430 Nyan Berry	330.00	330.00	330.00	287.10	ROO	330	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:45.654	2025-11-19 12:51:45.654	6344984c-c24a-41d5-a3cc-603fd1224b0e
2ef312e3-987d-4151-9957-f34ee5bb1acc	0	680 บาท ได้รับ 900 Nyan Berry	680.00	680.00	680.00	591.60	ROO	680	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:45.744	2025-11-19 12:51:45.744	6344984c-c24a-41d5-a3cc-603fd1224b0e
4d8bc4e5-f825-4457-b6f8-7676b2e62591	0	1,700 บาท ได้รับ 2,300 Nyan Berry	1700.00	1700.00	1700.00	1479.00	ROO	1700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:45.832	2025-11-19 12:51:45.832	6344984c-c24a-41d5-a3cc-603fd1224b0e
57b10bc8-b0f6-46cd-8504-22c7996ae0ef	0	3,500 บาท ได้รับ 4,800 Nyan Berry	3500.00	3500.00	3500.00	3045.00	ROO	3500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:45.921	2025-11-19 12:51:45.921	6344984c-c24a-41d5-a3cc-603fd1224b0e
32b0459c-5c9c-42e5-8253-e9ee5a4edb78	0	7,000 บาท ได้รับ 9,600 Nyan Berry	7000.00	7000.00	7000.00	6090.00	ROO	7000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:46.009	2025-11-19 12:51:46.009	6344984c-c24a-41d5-a3cc-603fd1224b0e
f9fd0275-436b-4a45-a3d2-5a2b80b4150b	0	34 บาท ได้รับ 123 Ruby	34.00	34.00	34.00	27.71	SEAL-M	34	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.244	2025-11-19 12:51:48.244	ecb0a2de-5636-478b-86cb-6454ac5acbe4
99b4c284-096f-4d7d-a960-d634a4bb6e48	0	67 บาท ได้รับ 250 Ruby	67.00	67.00	67.00	54.61	SEAL-M	67	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.332	2025-11-19 12:51:48.332	ecb0a2de-5636-478b-86cb-6454ac5acbe4
dcb1c291-545b-41a5-9509-9eb0dd4b7574	0	200 บาท ได้รับ 775 Ruby	200.00	200.00	200.00	163.00	SEAL-M	200	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.419	2025-11-19 12:51:48.419	ecb0a2de-5636-478b-86cb-6454ac5acbe4
6264e6cd-11bc-4b40-b93f-e01a7adae360	0	333 บาท ได้รับ 1,300 Ruby	333.00	333.00	333.00	271.40	SEAL-M	333	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.507	2025-11-19 12:51:48.507	ecb0a2de-5636-478b-86cb-6454ac5acbe4
bce4a0d3-d341-4f9d-9afa-39f9064a1bce	0	665 บาท ได้รับ 2,650 Ruby	665.00	665.00	665.00	541.98	SEAL-M	665	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.596	2025-11-19 12:51:48.596	ecb0a2de-5636-478b-86cb-6454ac5acbe4
54eb99df-32d8-41cf-b893-cd98775f56db	0	1,330 บาท ได้รับ 5,375 Ruby	1330.00	1330.00	1330.00	1083.95	SEAL-M	1330	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.683	2025-11-19 12:51:48.683	ecb0a2de-5636-478b-86cb-6454ac5acbe4
da251e90-429e-4c27-b36a-35929b82a07d	0	4,150 บาท ได้รับ 17,500 Ruby	4150.00	4150.00	4150.00	3382.25	SEAL-M	4150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.77	2025-11-19 12:51:48.77	ecb0a2de-5636-478b-86cb-6454ac5acbe4
feed1758-5fda-4d20-ab7b-362a275a2c2c	0	8,300 บาท ได้รับ 35,400 Ruby	8300.00	8300.00	8300.00	6764.50	SEAL-M	8300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:48.858	2025-11-19 12:51:48.858	ecb0a2de-5636-478b-86cb-6454ac5acbe4
aa921ad1-45e0-49a3-81ca-36446cb4bf1f	0	Covenant of encouragement 500 บาท	500.00	500.00	500.00	407.50	ROX	500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.302	2025-11-19 12:51:49.302	657543b4-3725-4917-800f-e41117e69104
6aa1f311-64f1-45a9-81e4-d31dd7d5d0cb	0	Assurance of Exclusivity 850 บาท	850.00	850.00	850.00	692.75	ROX	850	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.39	2025-11-19 12:51:49.39	657543b4-3725-4917-800f-e41117e69104
b726e31d-80c6-4328-a9c0-4f200da3d3e4	0	Oath of Bond 1,380 บาท	1380.00	1380.00	1380.00	1124.70	ROX	1380	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.477	2025-11-19 12:51:49.477	657543b4-3725-4917-800f-e41117e69104
71e2502f-dbd3-47f7-8b7b-60ecefb1e486	0	165 บาท ได้รับ 2,280 Diamonds	165.00	165.00	165.00	134.48	ROX	165	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.565	2025-11-19 12:51:49.565	657543b4-3725-4917-800f-e41117e69104
015fd75d-3e4d-423f-90b0-853d1b84bee0	0	329 บาท ได้รับ 4,550 Diamonds	329.00	329.00	329.00	268.14	ROX	329	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.653	2025-11-19 12:51:49.653	657543b4-3725-4917-800f-e41117e69104
680ed2f5-bb31-4806-ac16-1eb49eb4773d	0	1,340 บาท ได้รับ 18,380 Diamonds	1340.00	1340.00	1340.00	1092.10	ROX	1340	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.741	2025-11-19 12:51:49.741	657543b4-3725-4917-800f-e41117e69104
ea5b62de-6a40-4f25-a5ff-2e7f7951a272	0	3,400 บาท ได้รับ 45,950 Diamonds	3400.00	3400.00	3400.00	2771.00	ROX	3400	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.828	2025-11-19 12:51:49.828	657543b4-3725-4917-800f-e41117e69104
6777bc04-ed3f-499d-8aad-cc538b06a4c7	0	6,800 บาท ได้รับ 94,620 Diamonds	6800.00	6800.00	6800.00	5542.00	ROX	6800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:49.915	2025-11-19 12:51:49.915	657543b4-3725-4917-800f-e41117e69104
c1632d6c-0c11-477a-af08-6b1da9949467	0	35 บาท ได้รับ 60 Jewels	35.00	35.00	35.00	26.78	HARRYPAWK	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:50.924	2025-11-19 12:51:50.924	e14cd26f-d3af-4062-88a3-df8c4e776b46
ce22487b-f9ef-4edc-9889-cf14e8146710	0	179 บาท ได้รับ 300 Jewels	179.00	179.00	179.00	136.94	HARRYPAWK	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.012	2025-11-19 12:51:51.012	e14cd26f-d3af-4062-88a3-df8c4e776b46
4675ecb5-2bee-428c-8efd-b8880939a0ad	0	379 บาท ได้รับ 750 Jewels	379.00	379.00	379.00	289.94	HARRYPAWK	379	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.1	2025-11-19 12:51:51.1	e14cd26f-d3af-4062-88a3-df8c4e776b46
4a8074a3-0993-4b28-a029-367dde602147	0	539 บาท ได้รับ 1,145 Jewels	539.00	539.00	539.00	412.34	HARRYPAWK	539	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.188	2025-11-19 12:51:51.188	e14cd26f-d3af-4062-88a3-df8c4e776b46
f5e9435e-1669-42c9-b816-2165f1d28f60	0	699 บาท ได้รับ 1,550 Jewels	699.00	699.00	699.00	534.74	HARRYPAWK	699	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.275	2025-11-19 12:51:51.275	e14cd26f-d3af-4062-88a3-df8c4e776b46
4a497143-09e0-4fba-afff-73834cd0e4d6	0	1,090 บาท ได้รับ 2,360 Jewels	1090.00	1090.00	1090.00	833.85	HARRYPAWK	1090	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.362	2025-11-19 12:51:51.362	e14cd26f-d3af-4062-88a3-df8c4e776b46
d9394e9b-848c-438e-aba7-0660b6dde305	0	1,800 บาท ได้รับ 4,060 Jewels	1800.00	1800.00	1800.00	1377.00	HARRYPAWK	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.451	2025-11-19 12:51:51.451	e14cd26f-d3af-4062-88a3-df8c4e776b46
4fb8a93a-667f-415c-8a2a-5695eb4dc826	0	3,550 บาท ได้รับ 8,480 Jewels	3550.00	3550.00	3550.00	2715.75	HARRYPAWK	3550	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.539	2025-11-19 12:51:51.539	e14cd26f-d3af-4062-88a3-df8c4e776b46
64a7699a-e292-4dbf-8b52-dc24c12f0e35	0	10,650 บาท ได้รับ 25,500 Jewels	10650.00	10650.00	10650.00	8147.25	HARRYPAWK	10650	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.627	2025-11-19 12:51:51.627	e14cd26f-d3af-4062-88a3-df8c4e776b46
46722ecb-18dc-4f81-a731-75c666ffa6c1	0	17,750 บาท ได้รับ 42,500 Jewels	17750.00	17750.00	17750.00	13578.75	HARRYPAWK	17750	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.715	2025-11-19 12:51:51.715	e14cd26f-d3af-4062-88a3-df8c4e776b46
1edb93a1-4182-4641-802f-90b3ab10f224	0	35,500 บาท ได้รับ 55,700 Jewels	35500.00	35500.00	35500.00	27157.50	HARRYPAWK	35500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:51.803	2025-11-19 12:51:51.803	e14cd26f-d3af-4062-88a3-df8c4e776b46
dcecf42b-800e-415c-8650-f76f5c4629ba	0	35 บาท ได้รับ 60+5 Tokens	35.00	35.00	35.00	28.35	ACERACER	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:52.725	2025-11-19 12:51:52.725	9afd2a92-41d2-4066-a411-fa4a619ade2f
4f9e6d60-8cea-4731-9cf7-396e20b9f2a6	0	149 บาท ได้รับ 250+20 Tokens	149.00	149.00	149.00	120.69	ACERACER	149	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:52.813	2025-11-19 12:51:52.813	9afd2a92-41d2-4066-a411-fa4a619ade2f
69405e6a-0184-4c38-85b6-974ce2925664	0	349 บาท ได้รับ 680+60 Tokens	349.00	349.00	349.00	282.69	ACERACER	349	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:52.9	2025-11-19 12:51:52.9	9afd2a92-41d2-4066-a411-fa4a619ade2f
4d9a58f1-f560-4cc0-a57d-d85c9420408e	0	649 บาท ได้รับ 1,180+120 Tokens	649.00	649.00	649.00	525.69	ACERACER	649	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:52.989	2025-11-19 12:51:52.989	9afd2a92-41d2-4066-a411-fa4a619ade2f
b12b646a-42b3-46d2-ac40-2b6579dce6c6	0	1,650 บาท ได้รับ 2,880+300 Tokens	1650.00	1650.00	1650.00	1336.50	ACERACER	1650	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:53.076	2025-11-19 12:51:53.076	9afd2a92-41d2-4066-a411-fa4a619ade2f
7493703e-8183-40e9-be66-3de932a538c3	0	3,200 บาท ได้รับ 5,880+650 Tokens	3200.00	3200.00	3200.00	2592.00	ACERACER	3200	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:53.164	2025-11-19 12:51:53.164	9afd2a92-41d2-4066-a411-fa4a619ade2f
1d1979e6-47f3-48ed-bdd4-3b36076f5b30	0	179 บาท ได้รับ 350 เพชรศักดิ์สิทธิ์	179.00	179.00	179.00	162.89	MU3-M	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:53.606	2025-11-19 12:51:53.606	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
c5873e05-2ce1-4eb8-b616-8cadd08daea0	0	549 บาท ได้รับ 1,050 เพชรศักดิ์สิทธิ์	549.00	549.00	549.00	499.59	MU3-M	549	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:53.693	2025-11-19 12:51:53.693	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
31f0d6e9-53cf-4e7c-b9ed-02954b0b9f32	0	1,100 บาท ได้รับ 2,100 เพชรศักดิ์สิทธิ์	1100.00	1100.00	1100.00	1001.00	MU3-M	1100	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:53.781	2025-11-19 12:51:53.781	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
54735223-cd94-4162-abd4-b1ba6f66fe5e	0	1,800 บาท ได้รับ 3,500 เพชรศักดิ์สิทธิ์	1800.00	1800.00	1800.00	1638.00	MU3-M	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:53.868	2025-11-19 12:51:53.868	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
dd7a9c6f-0d2b-4c35-89b7-351173047d84	0	3,700 บาท ได้รับ 7,000 เพชรศักดิ์สิทธิ์	3700.00	3700.00	3700.00	3367.00	MU3-M	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:53.955	2025-11-19 12:51:53.955	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
b980d46b-6c12-4baf-b6eb-ebdfe0bf7380	0	5,500 บาท ได้รับ 10,500 เพชรศักดิ์สิทธิ์	5500.00	5500.00	5500.00	5005.00	MU3-M	5500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:54.043	2025-11-19 12:51:54.043	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
195b8a6b-3314-4390-bb8c-04a1a5cb1be5	0	7,200 บาท ได้รับ 14,000 เพชรศักดิ์สิทธิ์	7200.00	7200.00	7200.00	6552.00	MU3-M	7200	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:54.131	2025-11-19 12:51:54.131	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
781afbd7-6e55-4d2e-be0b-8f6789b42252	0	10,900 บาท ได้รับ 21,000 เพชรศักดิ์สิทธิ์	10900.00	10900.00	10900.00	9919.00	MU3-M	10900	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:54.218	2025-11-19 12:51:54.218	68a00fe6-9d5e-4115-b8bf-9209a2cf44dc
5a00a9e4-b8eb-46e3-95dc-9e2bdae64809	0	34.26 บาท ได้รับ 60 Eternal Orbs	34.26	34.26	34.26	28.95	DIABLO-IMM	34.26	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:54.664	2025-11-19 12:51:54.664	0b071a33-6128-41ca-aff4-40113a9399e2
618c6cc0-1623-4301-aef8-41122edcddde	0	172.70 บาท ได้รับ 320 Eternal Orbs	172.70	172.70	172.70	145.93	DIABLO-IMM	172.7	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:54.752	2025-11-19 12:51:54.752	0b071a33-6128-41ca-aff4-40113a9399e2
6008ac26-017a-4a6a-990a-37b265c61c58	0	345.75 บาท ได้รับ 650 Eternal Orbs	345.75	345.75	345.75	292.16	DIABLO-IMM	345.75	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:54.839	2025-11-19 12:51:54.839	0b071a33-6128-41ca-aff4-40113a9399e2
96081e90-b65f-4a2b-b678-7aa010ca9680	0	864.90 บาท ได้รับ 1,650Eternal Orbs	864.90	864.90	864.90	730.84	DIABLO-IMM	864.9	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:54.927	2025-11-19 12:51:54.927	0b071a33-6128-41ca-aff4-40113a9399e2
fc66bc1d-0596-4474-8fe4-82c3bf617b6d	0	1,730.15 บาท ได้รับ 3,450 Eternal Orbs	1730.15	1730.15	1730.15	1461.98	DIABLO-IMM	1730.15	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.015	2025-11-19 12:51:55.015	0b071a33-6128-41ca-aff4-40113a9399e2
31964c7e-949a-49cf-9708-21ef368d167f	0	3,400 บาท ได้รับ 7,200 Eternal Orbs	3400.00	3400.00	3400.00	2873.00	DIABLO-IMM	3400	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.103	2025-11-19 12:51:55.103	0b071a33-6128-41ca-aff4-40113a9399e2
fc8aff91-9919-4352-bbd0-c8b08e71139e	0	35 บาท ได้รับ 61 CANDIES	35.00	35.00	35.00	28.53	SAUSAGE	35	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.547	2025-11-19 12:51:55.547	7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e
24b1adc3-cbe0-4546-9e66-a188ef38ac96	0	179 บาท ได้รับ 318 CANDIES	179.00	179.00	179.00	145.89	SAUSAGE	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.634	2025-11-19 12:51:55.634	7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e
1fb9e185-b020-45cd-960b-58cb9c19f76f	0	349 บาท ได้รับ 686 CANDIES	349.00	349.00	349.00	284.44	SAUSAGE	349	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.721	2025-11-19 12:51:55.721	7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e
5a9b8e5b-b07f-4acb-810a-4a85b2b5e22c	0	729 บาท ได้รับ 1,378 CANDIES	729.00	729.00	729.00	594.14	SAUSAGE	729	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.808	2025-11-19 12:51:55.808	7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e
a892f7c5-289b-4b6a-ad15-d6300050fbbb	0	1,100 บาท ได้รับ 2,118 CANDIES	1100.00	1100.00	1100.00	896.50	SAUSAGE	1100	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.899	2025-11-19 12:51:55.899	7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e
3847edab-cdd8-46e5-bcea-53e9b1ec9e02	0	1,800 บาท ได้รับ 3,548 CANDIES	1800.00	1800.00	1800.00	1467.00	SAUSAGE	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:55.987	2025-11-19 12:51:55.987	7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e
d1181582-fe6f-44d5-8c47-fa78301dcc44	0	3,700 บาท ได้รับ 7,108 CANDIES	3700.00	3700.00	3700.00	3015.50	SAUSAGE	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:56.074	2025-11-19 12:51:56.074	7bb9c85c-e860-46f7-bc0b-c551ac2eaf5e
0bafdb78-f9e3-4e84-8d1d-b659dc79ebf2	0	Weekly Card 36 บาท	36.00	36.00	36.00	33.48	SUPERSUS	36	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:56.521	2025-11-19 12:51:56.521	16bee30a-9c4d-49e5-8d90-c0f78adcd388
51e2f9a2-e23e-4469-bfbc-32593dc3e639	0	Monthly Card 361 บาท	361.00	361.00	361.00	335.73	SUPERSUS	361	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:56.61	2025-11-19 12:51:56.61	16bee30a-9c4d-49e5-8d90-c0f78adcd388
0630dce8-a2d2-40d4-b858-6f33a5687ff0	0	SUPER PASS 180 บาท	180.00	180.00	180.00	167.40	SUPERSUS	180	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:56.698	2025-11-19 12:51:56.698	16bee30a-9c4d-49e5-8d90-c0f78adcd388
eb3c54af-b85b-4c56-ab90-b767f9d7f7d8	0	SUPER PASS BUNDLE 343 บาท	343.00	343.00	343.00	318.99	SUPERSUS	343	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:56.788	2025-11-19 12:51:56.788	16bee30a-9c4d-49e5-8d90-c0f78adcd388
157db4fa-555f-42f1-9fbd-cb991c5e8dad	0	Super VIP Card 415 บาท	415.00	415.00	415.00	385.95	SUPERSUS	415	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:56.876	2025-11-19 12:51:56.876	16bee30a-9c4d-49e5-8d90-c0f78adcd388
7860bdcb-dccf-4303-8716-6ff64fbaae59	0	27 บาท ได้รับ 100 Goldstar	27.00	27.00	27.00	25.11	SUPERSUS	27	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:56.964	2025-11-19 12:51:56.964	16bee30a-9c4d-49e5-8d90-c0f78adcd388
07209c29-1479-4ec5-9ace-c160ea5306f0	0	80 บาท ได้รับ 310 Goldstar	80.00	80.00	80.00	74.40	SUPERSUS	80	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:57.052	2025-11-19 12:51:57.052	16bee30a-9c4d-49e5-8d90-c0f78adcd388
862dacbb-7d0a-4d28-9cb2-40538e6bce6e	0	133 บาท ได้รับ 520 Goldstar	133.00	133.00	133.00	123.69	SUPERSUS	133	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:57.139	2025-11-19 12:51:57.139	16bee30a-9c4d-49e5-8d90-c0f78adcd388
3b6df21f-538e-4769-b80c-90a56cd3d429	0	269 บาท ได้รับ 1060 Goldstar	269.00	269.00	269.00	250.17	SUPERSUS	269	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:57.227	2025-11-19 12:51:57.227	16bee30a-9c4d-49e5-8d90-c0f78adcd388
d96a9d6f-2fe6-458e-a47c-c3cc8562bf31	0	555 บาท ได้รับ 2,180 Goldstar	555.00	555.00	555.00	516.15	SUPERSUS	555	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:57.315	2025-11-19 12:51:57.315	16bee30a-9c4d-49e5-8d90-c0f78adcd388
599feef1-34b3-445a-ac93-6a2ace81ac25	0	1,418 บาท ได้รับ 5,600 Goldstar	1418.00	1418.00	1418.00	1318.74	SUPERSUS	1418	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:57.402	2025-11-19 12:51:57.402	16bee30a-9c4d-49e5-8d90-c0f78adcd388
a38f6a5e-048f-4728-acd2-cd40f6fde7db	0	Weekly Treasure Trove 175 บาท &#9656; 600 Gold, 1x Common Mystery Border, 65x Random Booter &#9656; จำกัดการซื้อ 1 ครั้งต่อ ID	175.01	175.01	175.01	152.26	MARVELSNAP	175.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:57.852	2025-11-19 12:51:57.852	4c7be57c-1702-401a-a3e7-78bea1fc7258
ed6dc4a6-e0ac-473c-9dff-13f25c732e35	0	Gold Pass 175 บาท &#9656; รับทันที 300 Gold และรับ 50 Gold ทุกวันนาน 30 วัน &#9656; จำกัดการซื้อ 1 ครั้งต่อ ID	175.02	175.02	175.02	152.27	MARVELSNAP	175.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:57.939	2025-11-19 12:51:57.939	4c7be57c-1702-401a-a3e7-78bea1fc7258
594580ac-7d9d-48f0-ae63-cb92ae993c4e	0	Pro Bundle 3,650 บาท &#9656; จำกัดการซื้อ 10 ครั้งต่อ ID	3650.01	3650.01	3650.01	3175.51	MARVELSNAP	3650.01	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.028	2025-11-19 12:51:58.028	4c7be57c-1702-401a-a3e7-78bea1fc7258
53c95637-06e3-4eb3-83b1-8b27bc0bd11f	0	175 บาท ได้รับ 300 Gold	175.00	175.00	175.00	152.25	MARVELSNAP	175	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.116	2025-11-19 12:51:58.116	4c7be57c-1702-401a-a3e7-78bea1fc7258
7ef4daf6-fef0-4b84-a42f-a416360e0380	0	375 บาท ได้รับ 700 Gold	375.00	375.00	375.00	326.25	MARVELSNAP	375	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.204	2025-11-19 12:51:58.204	4c7be57c-1702-401a-a3e7-78bea1fc7258
4cae561a-9065-4f7f-9917-7990c104f341	0	720 บาท ได้รับ 1,450 Gold	720.00	720.00	720.00	626.40	MARVELSNAP	720	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.292	2025-11-19 12:51:58.292	4c7be57c-1702-401a-a3e7-78bea1fc7258
4f15ba97-d561-4af1-9af0-43e81f7d3e15	0	1,300 บาท ได้รับ 2,600 Gold	1300.00	1300.00	1300.00	1131.00	MARVELSNAP	1300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.38	2025-11-19 12:51:58.38	4c7be57c-1702-401a-a3e7-78bea1fc7258
05286764-3862-4cbf-91b1-457cef679870	0	1,800 บาท ได้รับ 3,850 Gold	1800.00	1800.00	1800.00	1566.00	MARVELSNAP	1800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.468	2025-11-19 12:51:58.468	4c7be57c-1702-401a-a3e7-78bea1fc7258
943355f5-9b4c-4eb5-a56e-a5763758057c	0	3,650 บาท ได้รับ 8,000 Gold	3650.00	3650.00	3650.00	3175.50	MARVELSNAP	3650	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.555	2025-11-19 12:51:58.555	4c7be57c-1702-401a-a3e7-78bea1fc7258
8cc1bd9b-90f9-458c-8628-76cd7b2e13c0	0	4,900 บาท ได้รับ 12,500 Gold	4900.00	4900.00	4900.00	4263.00	MARVELSNAP	4900	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.643	2025-11-19 12:51:58.643	4c7be57c-1702-401a-a3e7-78bea1fc7258
8e671423-4dfc-4f09-b90c-a8321daab1e4	0	6,500 บาท ได้รับ 17,000 Gold	6500.00	6500.00	6500.00	5655.00	MARVELSNAP	6500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:58.731	2025-11-19 12:51:58.731	4c7be57c-1702-401a-a3e7-78bea1fc7258
69761234-f45b-4cd6-8a28-02b81d0a34d0	0	185 บาท ได้รับ 50 Tokens ♦️+ โบนัส 2 Tokens ♦️ รวม 52 Tokens ♦️	185.00	185.00	185.00	150.78	XHERO	185	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.167	2025-11-19 12:51:59.167	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
8e701032-51d6-43b4-bc0b-0598f1ea6950	0	370 บาท ได้รับ 100 Tokens ♦️+ โบนัส 4 Tokens ♦️ รวม 104 Tokens ♦️	370.00	370.00	370.00	301.55	XHERO	370	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.254	2025-11-19 12:51:59.254	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
dde6266d-8cc3-47a2-93db-55e96f82d0d4	0	555 บาท ได้รับ 150 Tokens ♦️+ โบนัส 6 Tokens ♦️ รวม 156 Tokens ♦️	555.00	555.00	555.00	452.33	XHERO	555	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.342	2025-11-19 12:51:59.342	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
de842022-cb79-4cf8-b7d4-118a135ebfd4	0	740 บาท ได้รับ 200 Tokens ♦️+ โบนัส 8 Tokens ♦️ รวม 208 Tokens ♦️	740.00	740.00	740.00	603.10	XHERO	740	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.43	2025-11-19 12:51:59.43	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
1f739fe5-0c33-4e3e-b147-d1eed186abf4	0	925 บาท ได้รับ 250 Tokens ♦️+ โบนัส 10 Tokens ♦️ รวม 260 Tokens ♦️	925.00	925.00	925.00	753.88	XHERO	925	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.518	2025-11-19 12:51:59.518	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
7cd7caed-b2cc-4582-9b32-2d76c1d113ae	0	1,850 บาท ได้รับ 500 Tokens ♦️+ โบนัส 20 Tokens ♦️ รวม 520 Tokens ♦️	1850.00	1850.00	1850.00	1507.75	XHERO	1850	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.606	2025-11-19 12:51:59.606	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
01ed307c-8dde-4758-8ded-5118b4ef7e26	0	3,700 บาท ได้รับ 1,000 Tokens ♦️+ โบนัส 40 Tokens ♦️ รวม 1,040 Tokens ♦️	3700.00	3700.00	3700.00	3015.50	XHERO	3700	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.693	2025-11-19 12:51:59.693	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
5a2a337b-cdaa-41ba-afde-3308aee72a58	0	7,400 บาท ได้รับ 2,000 Tokens ♦️+ โบนัส 80 Tokens ♦️ รวม 2,080 Tokens ♦️	7400.00	7400.00	7400.00	6031.00	XHERO	7400	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.829	2025-11-19 12:51:59.829	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
37635e52-7ba1-4a46-a8d5-5205d2d9455e	0	14,800 บาท ได้รับ 4,000 Tokens ♦️+ โบนัส 160 Tokens ♦️ รวม 4,160 Tokens ♦️	14800.00	14800.00	14800.00	12062.00	XHERO	14800	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:51:59.916	2025-11-19 12:51:59.916	081afc7c-109c-4af5-ac06-3f2f3ffd0edc
5f0bcb2c-6789-4cf7-b480-ee90099e9e02	0	69 บาท ได้รับ 123 Diamonds	69.00	69.00	69.00	56.24	NIKKE	69	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:00.838	2025-11-19 12:52:00.838	e9a182be-07a2-489c-96d5-b74c7365fe2e
e9a77bd1-1f46-431a-a3b5-f3b60ef60670	0	179 บาท ได้รับ 330 Diamonds	179.00	179.00	179.00	145.89	NIKKE	179	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:00.925	2025-11-19 12:52:00.925	e9a182be-07a2-489c-96d5-b74c7365fe2e
51af108b-c535-4a3f-a2c1-27cdce6a2ee4	0	349 บาท ได้รับ 840 Diamonds	349.00	349.00	349.00	284.44	NIKKE	349	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:01.013	2025-11-19 12:52:01.013	e9a182be-07a2-489c-96d5-b74c7365fe2e
fdacc196-12b1-4dc8-a7aa-ccae538f5c6a	0	729 บาท ได้รับ 1,760 Diamonds	729.00	729.00	729.00	594.14	NIKKE	729	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:01.101	2025-11-19 12:52:01.101	e9a182be-07a2-489c-96d5-b74c7365fe2e
88352c49-3aab-4b47-b0d6-8591c077cb7f	0	1,100 บาท ได้รับ 2,700 Diamonds	1100.00	1100.00	1100.00	896.50	NIKKE	1100	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:01.189	2025-11-19 12:52:01.189	e9a182be-07a2-489c-96d5-b74c7365fe2e
378e3e42-4c96-4256-97f0-ace30edf1bea	0	2,000 บาท ได้รับ 5,200 Diamonds	2000.00	2000.00	2000.00	1630.00	NIKKE	2000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:01.277	2025-11-19 12:52:01.277	e9a182be-07a2-489c-96d5-b74c7365fe2e
90a43339-45d9-4d3a-999f-b6bf81c81ca5	0	2,900 บาท ได้รับ 7,700 Diamonds	2900.00	2900.00	2900.00	2363.50	NIKKE	2900	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:01.364	2025-11-19 12:52:01.364	e9a182be-07a2-489c-96d5-b74c7365fe2e
1f1b862c-af62-4513-bedf-3fd5b5ce3662	0	0 บาท	0.00	0.00	0.00	0.00	OVERWATCH2	0	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:01.806	2025-11-19 12:52:01.806	cc82ef95-916e-4cbc-a185-342ea8f48df6
b3fd0d78-9a73-4948-877f-e5be5e910098	0	Premium Card 299 บาท	274.02	274.02	274.02	238.40	RO-M	274.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:02.644	2025-11-19 12:52:02.644	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
fd116fac-5f2e-4bd4-bdad-66aecce824bf	0	34.50 บาท ได้รับ 7 Big Cat Coin	34.50	34.50	34.50	30.02	RO-M	34.5	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:02.731	2025-11-19 12:52:02.731	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
bbd7eab7-0790-4bc3-8f89-e3033656ab90	0	68 บาท ได้รับ 14 Big Cat Coin	68.00	68.00	68.00	59.16	RO-M	68	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:02.818	2025-11-19 12:52:02.818	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
ebd50b2a-528b-432a-9da2-d59715a980f7	0	103 บาท ได้รับ 21 Big Cat Coin	103.00	103.00	103.00	89.61	RO-M	103	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:02.906	2025-11-19 12:52:02.906	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
02c2a787-1221-44c5-93bc-8a4bf6b314ef	0	136 บาท ได้รับ 24 Big Cat Coin	136.00	136.00	136.00	118.32	RO-M	136	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:02.993	2025-11-19 12:52:02.993	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
625c4d28-85be-4f9f-99d9-828a1cba1d22	0	172 บาท ได้รับ 36 Big Cat Coin	172.00	172.00	172.00	149.64	RO-M	172	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:03.08	2025-11-19 12:52:03.08	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
5297795b-a6c9-4781-9777-06875560ca0e	0	343 บาท ได้รับ 72 Big Cat Coin	343.00	343.00	343.00	298.41	RO-M	343	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:03.167	2025-11-19 12:52:03.167	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
f8603a26-7209-4568-8df3-fdcf61e27a8a	0	685 บาท ได้รับ 145 Big Cat Coin	685.00	685.00	685.00	595.95	RO-M	685	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:03.255	2025-11-19 12:52:03.255	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
84f6cbeb-3843-4ea4-9153-e3045f0e8af6	0	1,655 บาท ได้รับ 373 Big Cat Coin	1655.00	1655.00	1655.00	1439.85	RO-M	1655	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:03.342	2025-11-19 12:52:03.342	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
00a714c2-5dc7-4ce4-a6ad-69b24fe08c29	0	3,320 บาท ได้รับ 748 Big Cat Coin	3320.00	3320.00	3320.00	2888.40	RO-M	3320	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:03.429	2025-11-19 12:52:03.429	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
09cc94eb-09d4-4bdd-a6de-551c2051fd6a	0	6,630 บาท ได้รับ 1,496 Big Cat Coin	6630.00	6630.00	6630.00	5768.10	RO-M	6630	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:03.517	2025-11-19 12:52:03.517	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
c26a888f-8dbe-4db3-91b2-ef3f62764c40	0	16,141 บาท ได้รับ 3,740 Big Cat Coin	16141.00	16141.00	16141.00	14042.67	RO-M	16141	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:03.605	2025-11-19 12:52:03.605	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
8164e0d0-28a8-4343-b092-8f8b62366231	0	50 บาท ได้รับ 93 Diamonds	50.00	50.00	50.00	45.75	MUAA	50	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:04.059	2025-11-19 12:52:04.059	52adb8e0-1e0a-452f-bb3b-863aa463831e
286a18ef-af73-4244-b5d1-4d87f9d3284a	0	90 บาท ได้รับ 167 Diamonds	90.00	90.00	90.00	82.35	MUAA	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:04.146	2025-11-19 12:52:04.146	52adb8e0-1e0a-452f-bb3b-863aa463831e
4ad30489-3d47-419d-9783-3d0a8c47ab66	0	150 บาท ได้รับ 279 Diamonds	150.00	150.00	150.00	137.25	MUAA	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:04.233	2025-11-19 12:52:04.233	52adb8e0-1e0a-452f-bb3b-863aa463831e
c96a5125-b6c8-49e0-9aa4-c52711d13d19	0	300 บาท ได้รับ 558 Diamonds	300.00	300.00	300.00	274.50	MUAA	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:04.325	2025-11-19 12:52:04.325	52adb8e0-1e0a-452f-bb3b-863aa463831e
ba98cb7e-ffb4-4ebb-9000-f6796a6d18c5	0	500 บาท ได้รับ 930 Diamonds	500.00	500.00	500.00	457.50	MUAA	500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:04.414	2025-11-19 12:52:04.414	52adb8e0-1e0a-452f-bb3b-863aa463831e
954839d2-a1ba-4a8c-b552-069970af77fb	0	30 บาท ได้รับ 60 Jade	30.00	30.00	30.00	25.20	G78NAGB	30	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:04.857	2025-11-19 12:52:04.857	eede4536-64ce-4b25-a04a-909e7ba799d6
826fc995-5030-44d2-afe5-62eb6947dc0f	0	150 บาท ได้รับ 300 Jade	150.00	150.00	150.00	126.00	G78NAGB	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:04.945	2025-11-19 12:52:04.945	eede4536-64ce-4b25-a04a-909e7ba799d6
4c6818f4-5a82-4b60-89e5-266ec38967bf	0	300 บาท ได้รับ 680 Jade	300.00	300.00	300.00	252.00	G78NAGB	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:05.033	2025-11-19 12:52:05.033	eede4536-64ce-4b25-a04a-909e7ba799d6
0faab480-604a-4b04-aa89-78352c0f95f7	0	613 บาท ได้รับ 1280 Jade	613.00	613.00	613.00	514.92	G78NAGB	613	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:05.122	2025-11-19 12:52:05.122	eede4536-64ce-4b25-a04a-909e7ba799d6
47059085-3c4e-4fb8-85fd-81ddb997e680	0	1,533 บาท ได้รับ 3280 Jade	1533.00	1533.00	1533.00	1287.72	G78NAGB	1533	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:05.219	2025-11-19 12:52:05.219	eede4536-64ce-4b25-a04a-909e7ba799d6
33e9e189-80a2-4ddf-b7dc-11c06e92bb97	0	3,065 บาท ได้รับ 6480 Jade	3065.00	3065.00	3065.00	2574.60	G78NAGB	3065	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:05.307	2025-11-19 12:52:05.307	eede4536-64ce-4b25-a04a-909e7ba799d6
af165b79-0e5c-419c-9de8-4b45c2803bcc	0	150 บาท ได้รับ 475 COINS	150.00	150.00	150.00	142.50	LOR	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:05.756	2025-11-19 12:52:05.756	8e557eda-5062-4dc4-8457-d091388203e6
980e9731-a80f-455d-8ace-534566251164	0	300 บาท ได้รับ 1,000 COINS	300.00	300.00	300.00	285.00	LOR	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:05.844	2025-11-19 12:52:05.844	8e557eda-5062-4dc4-8457-d091388203e6
111090ad-1ea9-402b-8b1c-68e15e49f396	0	600 บาท ได้รับ 2,050 COINS	600.00	600.00	600.00	570.00	LOR	600	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:05.937	2025-11-19 12:52:05.937	8e557eda-5062-4dc4-8457-d091388203e6
29622986-5600-4afe-9b04-483a8e0cdd7a	0	1,050 บาท ได้รับ 3,650 COINS	1050.00	1050.00	1050.00	997.50	LOR	1050	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.025	2025-11-19 12:52:06.025	8e557eda-5062-4dc4-8457-d091388203e6
e7a0490d-e839-42f9-be09-5a57ee661a99	0	1,450 บาท ได้รับ 5,350 COINS	1450.00	1450.00	1450.00	1377.50	LOR	1450	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.113	2025-11-19 12:52:06.113	8e557eda-5062-4dc4-8457-d091388203e6
cf2653c9-74d8-4372-af64-e6aac3b63640	0	2,900 บาท ได้รับ 11,000 COINS	2900.00	2900.00	2900.00	2755.00	LOR	2900	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.201	2025-11-19 12:52:06.201	8e557eda-5062-4dc4-8457-d091388203e6
50a0ff8b-c0e2-4269-90f1-1aaa77e3cb6c	0	150 บาท ได้รับ 425 Cores	150.00	150.00	150.00	142.50	WILDRIFT	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.644	2025-11-19 12:52:06.644	3d9821fe-4519-4e1e-961b-3a636ae2042a
993f395b-fb10-476c-8f45-d17377d8d85d	0	340 บาท ได้รับ 1,000 Cores	340.00	340.00	340.00	323.00	WILDRIFT	340	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.732	2025-11-19 12:52:06.732	3d9821fe-4519-4e1e-961b-3a636ae2042a
d0c8115c-c2df-4a4b-9fcd-7e939bec499f	0	600 บาท ได้รับ 1,850 Cores	600.00	600.00	600.00	570.00	WILDRIFT	600	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.82	2025-11-19 12:52:06.82	3d9821fe-4519-4e1e-961b-3a636ae2042a
942daec5-0b70-4595-a489-bb0e8bfdec56	0	1,050 บาท ได้รับ 3,275 Cores	1050.00	1050.00	1050.00	997.50	WILDRIFT	1050	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.909	2025-11-19 12:52:06.909	3d9821fe-4519-4e1e-961b-3a636ae2042a
e6f268f6-efdd-4f46-8beb-76f020ccd07a	0	1,500 บาท ได้รับ 4,800 Cores	1500.00	1500.00	1500.00	1425.00	WILDRIFT	1500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:06.997	2025-11-19 12:52:06.997	3d9821fe-4519-4e1e-961b-3a636ae2042a
45ddf620-6750-426b-ab13-f59246672acb	0	3,000 บาท ได้รับ 10,000 Cores	3000.00	3000.00	3000.00	2850.00	WILDRIFT	3000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:07.084	2025-11-19 12:52:07.084	3d9821fe-4519-4e1e-961b-3a636ae2042a
7c292dd9-1d60-4475-a822-1c58b34191ac	0	480 บาท ได้รับ Investment Fund	480.02	480.02	480.02	391.22	DRAGONRAJA	480.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:07.568	2025-11-19 12:52:07.568	7cc68af6-955a-451f-a664-6715c946e2d7
57de3280-ee8f-429d-a7c3-fc1734a9f5cb	0	640 บาท ได้รับ Investment Fund II	640.02	640.02	640.02	521.62	DRAGONRAJA	640.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:07.655	2025-11-19 12:52:07.655	7cc68af6-955a-451f-a664-6715c946e2d7
dd2874bc-5636-4020-aa44-ca7149fdc09b	0	33 บาท ได้รับ 66 Coupons	33.00	33.00	33.00	26.90	DRAGONRAJA	33	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:07.744	2025-11-19 12:52:07.744	7cc68af6-955a-451f-a664-6715c946e2d7
671075b8-c63c-4cfb-ae52-d9cb3406aaeb	0	130 บาท ได้รับ 264 Coupons	130.00	130.00	130.00	105.95	DRAGONRAJA	130	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:07.832	2025-11-19 12:52:07.832	7cc68af6-955a-451f-a664-6715c946e2d7
ac266c70-3305-4801-b01d-92a9e9ab4f65	0	488 บาท ได้รับ 1,098 Coupons	488.00	488.00	488.00	397.72	DRAGONRAJA	488	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:07.92	2025-11-19 12:52:07.92	7cc68af6-955a-451f-a664-6715c946e2d7
2f1d0ac7-26e0-4043-90c6-a40db963ddec	0	975 บาท ได้รับ 2,246 Coupons	975.00	975.00	975.00	794.63	DRAGONRAJA	975	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.007	2025-11-19 12:52:08.007	7cc68af6-955a-451f-a664-6715c946e2d7
df7363d3-1e50-4b7a-bc27-f00b95e20a20	0	1,625 บาท ได้รับ 3,768 Coupons	1625.00	1625.00	1625.00	1324.38	DRAGONRAJA	1625	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.095	2025-11-19 12:52:08.095	7cc68af6-955a-451f-a664-6715c946e2d7
70752e72-dcc0-4501-8059-4cc31de96db4	0	3,250 บาท ได้รับ 7,546 Coupons	3250.00	3250.00	3250.00	2648.75	DRAGONRAJA	3250	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.183	2025-11-19 12:52:08.183	7cc68af6-955a-451f-a664-6715c946e2d7
d4f5fa75-526b-40a0-9768-fb3defbd2396	0	6,500 บาท ได้รับ 1,5092 Coupons	6500.00	6500.00	6500.00	5297.50	DRAGONRAJA	6500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.27	2025-11-19 12:52:08.27	7cc68af6-955a-451f-a664-6715c946e2d7
9b6c02fa-75cf-4eae-8182-4341e36d0f8a	0	50 บาท ได้รับ 96 เหรียญองค์การบริหารโลก	50.00	50.00	50.00	45.75	CTSIDE	50	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.712	2025-11-19 12:52:08.712	25252e18-d1aa-42e8-8529-5ba667e49715
90ccd046-8d5c-4ea6-9a3e-50e6a73f8af4	0	90 บาท ได้รับ 185 เหรียญองค์การบริหารโลก	90.00	90.00	90.00	82.35	CTSIDE	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.8	2025-11-19 12:52:08.8	25252e18-d1aa-42e8-8529-5ba667e49715
987bd095-6308-49bd-87ef-8c14b5b9ddc9	0	150 บาท ได้รับ 301 เหรียญองค์การบริหารโลก	150.00	150.00	150.00	137.25	CTSIDE	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.888	2025-11-19 12:52:08.888	25252e18-d1aa-42e8-8529-5ba667e49715
9020439c-4c0e-48fd-817c-94e0b0649d80	0	300 บาท ได้รับ 603 เหรียญองค์การบริหารโลก	300.00	300.00	300.00	274.50	CTSIDE	300	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:08.976	2025-11-19 12:52:08.976	25252e18-d1aa-42e8-8529-5ba667e49715
8a7ee582-1aec-4b7f-b692-77ebc6ae33df	0	500 บาท ได้รับ 1,077 เหรียญองค์การบริหารโลก	500.00	500.00	500.00	457.50	CTSIDE	500	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:09.064	2025-11-19 12:52:09.064	25252e18-d1aa-42e8-8529-5ba667e49715
1deb25d4-4405-4ac4-ab7d-71f0604b86ee	0	1,000 บาท ได้รับ 2,184 เหรียญองค์การบริหารโลก	1000.00	1000.00	1000.00	915.00	CTSIDE	1000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:09.152	2025-11-19 12:52:09.152	25252e18-d1aa-42e8-8529-5ba667e49715
316c4d55-d14f-4bd7-adc2-2a3bdae1e49b	0	50 บาท ได้รับ 85 Diamonds	50.00	50.00	50.00	45.75	EOSRED	50	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:10.336	2025-11-19 12:52:10.336	40f6f086-ee98-401a-85d7-a4cf7a8de687
49e3ce5a-8c62-4271-b42a-8a564b5df32c	0	90 บาท ได้รับ 150 Diamonds	90.00	90.00	90.00	82.35	EOSRED	90	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:10.423	2025-11-19 12:52:10.423	40f6f086-ee98-401a-85d7-a4cf7a8de687
2fd0d6fd-3eb8-412a-ab67-da17166fb2ae	0	150 บาท ได้รับ 250 Diamonds	150.00	150.00	150.00	137.25	EOSRED	150	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:10.51	2025-11-19 12:52:10.51	40f6f086-ee98-401a-85d7-a4cf7a8de687
b5853ca5-7aad-4775-8d3e-75bd28e978c7	0	1,000 บาท ได้รับ 1,700 Diamonds	1000.00	1000.00	1000.00	915.00	EOSRED	1000	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:52:10.598	2025-11-19 12:52:10.598	40f6f086-ee98-401a-85d7-a4cf7a8de687
10a87de1-28f5-4343-8ec3-07983162f7f7	0	BP Card 90 บาทบูย่าห์พาสหากเปิดใช้งานสิทธิ์ขั้นสูงซีซั่นนี้ซ้ำซ้อนจะได้รับ FF Token 10 ชิ้นเป็นการชดเชย	92.02	90.02	90.02	85.29	FREEFIRE	90.02	https://cdn-icons-png.flaticon.com/512/5930/5930147.png	t	2025-11-19 12:50:45.009	2025-11-22 15:15:39.93	7b8c11c7-42ec-4c43-a165-b7f977e3ac2f
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product (id, name, price, pricevip, agent_price, img, des, category, active, "createdAt", "updatedAt") FROM stdin;
5	❣️แอคไทยไม่เคลม Netflix 1 วัน (จอเสริม)	25	18	15	https://img.rdcw.co.th/images/a54fd7ac2784d7c40d1b86f1a7ee3dde39403b23b4eeee439a76b7dd98393588.png	จอเสริม = เมลส่วนตัว (1เมล/1คน) \n\n✔️ สามารถรับชมได้ทุกอุปกรณ์ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถเข้าได้มากกว่า 1 เครื่อง\n✔️ ความละเอียดระดับ UltraHD 4K \n❌ ไม่เคลมหากโดนปิดบัญชี 		t	2025-10-07 03:49:05.334	2025-10-07 03:49:05.334
28	IQIYI Gold 30 วัน (จอหาร) ÷4	40	23	20	https://img.rdcw.co.th/images/bf84ffaff54875d7c3629e742ca929485b5bd9d94c687dbfc9ebb0116f38a734.png	 • IQIY Gold Standard ( แชร์ 4 )  \n • รับชมได้ 1 จอ  สามารถรับชมได้พร้อมกันแค่ 2 จอ \n • หากจอชนต้องรอเท่านั้น\n • ความละเอียดระดับ 1080P  \n •  ไม่สามารถเปลี่ยนข้อมูลได้   \n • ห้ามกดอัพเกรด หากมีคนกดไม่รับเคลมทุกกรณี		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
29	IQIYI Gold 30 วัน (จอส่วนตัว)	100	75	72	https://img.rdcw.co.th/images/d81f3ee824d78141b095638cd3a0dbfd82567eac786719dde623e295afcfc694.png	 • IQIY Gold ( จอส่วนตัว )  \n • สามารถรับชมได้พร้อมกันแค่ 2 จอ \n • ความละเอียดระดับ 1080P  \n • ไม่สามารถเปลี่ยนข้อมูลได้   \n • ห้ามกดอัพเกรด หากมีคนกดไม่รับเคลมทุกกรณี		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
30	VIU 7 วัน (จอหาร)	10	4	4	https://img.rdcw.co.th/images/ae1f755de54d42a414132b0927c48efdc5dc29b1de11b528da94514381ec5f78.png	⏰ วันใช้งาน 7 วัน\n\n➢ บัญชีประเทศไทย\n➢ จอหาร หากจอชนต้องรอ\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามนำบัญชีไปหารต่อ / แบน\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
31	VIU 30 วัน (จอหาร) ÷4	35	15	15	https://img.rdcw.co.th/images/0d521c715f2882e5bd2b07194f155d7a1e606551a3f63f0ff90b953042917514.png	⏰ วันใช้งาน 30 วัน\n\n➢ บัญชีประเทศไทย\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
32	VIU 30 วัน (จอหาร) ÷5	25	12	12	https://img.rdcw.co.th/images/ee9b37159b9a3326f9d3eef84914e097b0022af03bc52690ea0ac4b4b0600411.png	⏰ วันใช้งาน 30 วัน\n\n➢ บัญชีประเทศไทย\n➢ จอหาร หากจอชนต้องรอ\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามนำบัญชีไปหารต่อ / แบน\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
26	IQIYI Gold 15 วัน (จอหาร)	25	15	12	https://img.rdcw.co.th/images/5b2d6d8231ca4dc7062bbf133ef5e7c3b90c959e358eed2ca52b439944e12abe.png	• IQIY Gold Standard ( แชร์ 4 )  \n • รับชมได้ 1 จอ  สามารถรับชมได้พร้อมกันแค่ 2 จอ \n • หากจอชนต้องรอเท่านั้น\n • ความละเอียดระดับ 1080P  \n •  ไม่สามารถเปลี่ยนข้อมูลได้   \n • ห้ามกดอัพเกรด หากมีคนกดไม่รับเคลมทุกกรณี		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
9	✨แอคนอกมีเคลม NF 7 วัน (TV) 	60	38	36	https://img.rdcw.co.th/images/d3529576c84e60b5d36771e9dd5217646e337f2d7dd36ec550ca77ecbc0b03df.png	✔️ สามารถชมผ่านทีวีได้ \n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
3	✨แอคนอกมีเคลม NF 1 วัน (TV) 	20	18	15	https://img.rdcw.co.th/images/5e88fe4a2fcdc487ec1ebb89a34f049b2ee3520d1ad5b9b784471a2f8de5fb1c.png	✔️ สามารถชมผ่านทีวีได้ \n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
14	CANVA 30 วัน ( เมลลค )	25	12	10	https://img.rdcw.co.th/images/a13194ba7884d6d5eb3ba2e953174dfc7a866d9fd3b11e3c35adc4a21efb74d6.png	<center>✿ CANVA 30 วัน ✿</center>\n◈ ━━━━━━━━━━━━━━ ◈\n 【✔️】เมล์ลูกค้าเข้าร่วม \n 【✔️】ใช้แคนวาโปร\n 【✔️】รับประกันตลอดการใช้งาน\n 【❌】กดเข้าร่วมเพียง 1 เมล์  เท่านั้น\n 【⚠】หลังจากเข้าเเล้วเเจ้งเมล์ด้วยทุกครั้ง\n◈ ━━━━━━━━━━━━━━ ◈		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
1	✨แอคนอกมีเคลม NF ตัด00.00 (ทุกอุปกรณ์) 	10	5	4	https://img.rdcw.co.th/images/ab8fd0a1ede229f325b3b7b0c75532a675fe9edef8029595fa0b9d0bb8eedfa9.png	✔️ สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.334	2025-10-07 03:49:05.334
2	✨แอคนอกมีเคลม NF 1 วัน (มือถือ) 	19	12	10	https://img.rdcw.co.th/images/785c01c8632d8751eb2e9571ff6c1ace5ed2bf86be858b4948a6b8d312278a46.png	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.334	2025-10-07 03:49:05.334
10	❣️แอคไทยไม่เคลม Netflix 7 วัน (จอเสริม)	75	55	52	https://img.rdcw.co.th/images/d0b330937c1be8c89a020ea43d76c580ecc5a99867f7eb25ab233d34d21421a2.png	จอเสริม = เมลส่วนตัว (1เมล/1คน) \n\n✔️ สามารถรับชมได้ทุกอุปกรณ์ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถเข้าได้มากกว่า 1 เครื่อง\n✔️ ความละเอียดระดับ UltraHD 4K \n❌ ไม่เคลมหากโดนปิดบัญชี 		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
25	Wetv 30 วัน (จอส่วนตัว)	100	75	72	https://img.rdcw.co.th/images/1ddfc97878ca4e5cefe14afaac11ae2329128f110dc2a48d941e8ee8a3ff76dc.png	⏰ วันใช้งาน 30 วัน\n\n➢ บัญชีประเทศไทย\n➢ จะได้รับเป็น Email/Password\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
52	Bilibili 30 วัน ( จอหาร ) ÷4	45	20	20	https://img.rdcw.co.th/images/67ab6fbbc3531ccc0ac8a17702cb03aa0d19c66ae4418a1ccfbb8046f976e299.png	▶️ Bilibili แอปดูการ์ตูนอนิเมะ<span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ Bilibili แพ็กเกจ  <span class="badge bg-warning">Premium รายเดือน</span></h6>  <li>website <a href="https://www.bilibili.tv/th" target="_blank">https://www.bilibili.tv/th</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
13	ACC NF 7 วัน นอก มีเคลม	175	155	150	https://img.rdcw.co.th/images/b9ec7fe5753465cfb08fad4281ed2e5d205e81bad4b4255b2d5b278fa738aca4.png	ยกแอค \nตัด22.00 ของวันหมดอายุ\nเคลียร์จอ ตั้งพินเองได้เลย		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
27	IQIYI Gold 30 วัน (จอหาร) ÷3	50	30	28	https://img.rdcw.co.th/images/e98f14c5987b0f88ac2581b1354cebf39f031189a0ade434737b5107890bd9a5.png	• IQIY Gold Standard ( แชร์ 3 )  \n • รับชมได้ 1 จอ  สามารถรับชมได้พร้อมกันแค่ 2 จอ \n • หากจอชนต้องรอเท่านั้น\n • ความละเอียดระดับ 1080P  \n •  ไม่สามารถเปลี่ยนข้อมูลได้   \n • ห้ามกดอัพเกรด หากมีคนกดไม่รับเคลมทุกกรณี		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
51	Bilibili 30 วัน ( จอหาร ) ÷3	55	35	35	https://img.rdcw.co.th/images/dac09f2ee9a2a8a4c600360ec000d318e849f999b0d267139601699b27167c1b.jpeg	▶️ Bilibili แอปดูการ์ตูนอนิเมะ<span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ Bilibili แพ็กเกจ  <span class="badge bg-warning">Premium รายเดือน</span></h6>  <li>website <a href="https://www.bilibili.tv/th" target="_blank">https://www.bilibili.tv/th</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
53	Bilibili 30 วัน ( REDEEM )	110	85	80	https://img.rdcw.co.th/images/f395b8219fc875e151a72da0750b24d1b9729a5919e8a4919d892a6b54750e03.png	▶️ Bilibili แอปดูการ์ตูนอนิเมะ<span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ Bilibili แพ็กเกจ  <span class="badge bg-warning">Premium รายเดือน</span></h6>  <li>website <a href="https://www.bilibili.tv/th" target="_blank">https://www.bilibili.tv/th</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
57	YOUKU VIP 90 วัน (จอหาร) ÷4	95	65	63	https://img.rdcw.co.th/images/dc5a830f559d30f00a4067ee361130ab732da28cc8f6d74237c42d12843078fa.png	▶️ YOUKU แอปดูหนัง/ซีรีย์ <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>  \n▶️ รับชม YOUKU Premium แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ YOUKU Premiumแพ็กเกจ  <span class="badge bg-warning">รายเดือน</span></h6>  <li>website <a href="https://youku.tv/" target="_blank">https://youku.tv/</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
147	DRAMA BOX ตัด 00.00 	35	29	27	https://img.rdcw.co.th/images/0121a507f54ff8ab82fc2ded6deed44d4a9e9d3f7f9b8a67953475420cac962e.jpeg	DRAMA BOX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
6	✨แอคนอกมีเคลม NF 3 วัน (มือถือ) 	28	20	18	https://img.rdcw.co.th/images/b3d383d5412072c436bd8565f94ec5acc6481ccacfcd6d4cd67f1c039c8c81be.png	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
12	ACC NF 1 วัน นอก มีเคลม	70	55	50	https://img.rdcw.co.th/images/04bf1fe021a2da3475a2b0d0db5eb6a6f0b60e48769c40b35767178b65afc495.png	ยกแอค \nตัด22.00 ของวันหมดอายุ\nเคลียร์จอ ตั้งพินเองได้เลย		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
35	PrimeVideo 7 วัน (ส่วนตัว) ÷4	29	20	18	https://img.rdcw.co.th/images/a6a8ba5ab702b0b5bb57784a3a24067b3beb00908eed2c43b112f3c96d6735c8.png	⏰ วันใช้งาน 7 วัน\n\n➢ บัญชีประเทศไทย\n➢ จอส่วนตัว\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามนำบัญชีไปหารต่อ / แบน\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\nเข้าได้เเค่คอมกับแอนดรอย ios เข้าไม่ได้\n*ไม่เคลมในกรณีโดนปิด*\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
15	CANVA 30 วัน ( เมลร้าน )	40	15	12	https://img.rdcw.co.th/images/a5f3e79a48c85079aaf908d2c449b4b5717269d596c751ac57e4bbf53d4c148e.png	<center>✿ CANVA 30 วัน ✿</center>\n◈ ━━━━━━━━━━━━━━ ◈\n 【✔️】เข้าสู้ระบบด้วยเมลเเละรหัส ไม่ใช่ google\n 【✔️】ใช้แคนวาโปร\n 【✔️】รับประกันตลอดการใช้งาน\n◈ ━━━━━━━━━━━━━━ ◈		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
23	Wetv 30 วัน (จอหาร) ÷4	45	25	22	https://img.rdcw.co.th/images/061ca60ed3f86a98333a4b5bce435b697a2e868035d087bb69122abc7878ae84.png	⏰ วันใช้งาน 30 วัน\n\n➢ บัญชีประเทศไทย\n➢ จอหาร หากจอชนต้องรอ\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามนำบัญชีไปหารต่อ / แบน\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
36	 PrimeVideo 30 วัน (ส่วนตัว) ÷4	60	50	47	https://img.rdcw.co.th/images/2d54e27808c808549ee840028fbf5a09dda61660402b4627de1a448471d7fe06.png	\n⏰ วันใช้งาน 30 วัน\n\n➢ บัญชีประเทศไทย\n➢ จอส่วนตัว\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามนำบัญชีไปหารต่อ / แบน\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\nเข้าได้เเค่คอมกับแอนดรอย ios เข้าไม่ได้\n*ไม่เคลมในกรณีโดนปิด*\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
22	Wetv 15 วัน (จอหาร)	25	12	10	https://img.rdcw.co.th/images/c116f75daf6cf9665447b71e564375c8ed690ccb2cf2c43164dc625969f887e1.png	⏰ วันใช้งาน 15 วัน\n\n➢ บัญชีประเทศไทย\n➢ จอหาร หากจอชนต้องรอ\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามนำบัญชีไปหารต่อ / แบน\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
24	Wetv 30 วัน (จอหาร) ÷5	35	20	18	https://img.rdcw.co.th/images/226e3785021a717695ebd7f1527bf9bb06cdeb9dca93328ac671995a468b7bf7.png	⏰ วันใช้งาน 30 วัน\n\n➢ บัญชีประเทศไทย\n➢ จอหาร หากจอชนต้องรอ\n➢ จะได้รับเป็น Email/Password\n❌ ห้ามนำบัญชีไปหารต่อ / แบน\n❌ ห้ามเปลี่ยนรหัสบัญชี / แบน\n\n⚠ รับประกันตลอดการใช้งาน ⚠		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
7	✨แอคนอกมีเคลม NF 3 วัน (TV) 	35	24	22	https://img.rdcw.co.th/images/271f38a6f50fcd2b2e74ba0bd08aaee69eae6b2bd96874b259b546923a827f5a.png	✔️ สามารถชมผ่านทีวีได้ \n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
39	MAX STANDARD 7 วัน ÷4	25	15	13	https://img.rdcw.co.th/images/d3475667f950285bdca3f637ecab016dea5034e5c1aadcd368ac9789ab3a091d.png	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
40	MAX STANDARD 15 วัน 	45	20	18	https://img.rdcw.co.th/images/6c66f7a00a40e6ad5db6c3df38e924c6e8d3131fb774c36e7d740f15385af3af.png	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
38	MAX STANDARD 7 วัน ÷3	35	20	18	https://img.rdcw.co.th/images/ad7ea2eea4ab3d28941a73e7c30149e03088110f58ec3ab9041869b391fe47e4.png	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
59	Spotify Premium 60 วัน (ลูกค้า)	75	55	50	https://img.rdcw.co.th/images/9528ed5083bc5b1c878fa884bf9d83856ea2d9315f6d069af4304f24149acc38.png	▶️ Spotify แอปฟังเพลงออนไลน์ รวมเพลงทุกประเทศ\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> ระดับพรีเมียม</span>\n▶️ ฟังเพลงขนาดปิดหน้าจอไม่มีโฆษณากวนใจ\n▶️ โหลดเพลงไว้ฟังขนาดออฟไลน์ได้\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ Spotify แพ็กเกจ <span class="badge bg-warning">รายเดือน</span\n <li>website <a href="https://open.spotify.com/" target="_blank">https://open.spotify.com/</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
64	TrueID+ 30 วัน ÷3	45	27	30	https://img.rdcw.co.th/images/3e28ee959aace4b2c38b57f275e8fa9eb9485619f6c22e68bb74ec3f322eafd3.jpeg	▶️ TrueID แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน/TVออนไลน์<span class="badge bg-dark "></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ รับชม TrueID+ แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Phone/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ TrueID แพ็กเกจ  <span class="badge bg-warning">TrueID+ รายเดือน</span></h6>  <li>website <a href="https://www.trueid.net/watch/th-th/trueidplus" target="_blank">https://www.trueid.net/watch/th-th/trueidplus</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
69	CH 3 Plus 30 วัน ( REDEEM )	90	70	70	https://img.rdcw.co.th/images/7309b9b8ee6d20ad7345a6645b3efab31717fecd0bc480584cd85e89aba5cdd5.jpeg	▶️ CH3 Plus แอปดูภาพยนตร์ / ซีรีส์ / ละคร การ์ตูน / ข่าวสด ย้อนหลัง <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ CH3 Plus แพ็กเกจ  <span class="badge bg-warning">Premium รายเดือน</span></h6>  <li>website <a href="https://ch3plus.com/" target="_blank">https://ch3plus.com/</a></l>\n\nวิธี รีดีม โค้ต ch3+\n\n1. เข้า เว็บไซต์ https://ch3plus.com/live#\n2. ล็อคอิน อีเมล+พาส ของลูกค้า\n3. มองมุมขวา  คลิ้ก ☰ เจอรูปคน (สวัสดี)  คลิ้กต่อ\n4. เจอคำว่า Redeem Code คลิ้ก\n5. นำโค้ตทางร้านเติม กดยืนยัน เสร็จ		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
78	microsoft 30 วัน ( เมลลค )	25	12	10	https://img.rdcw.co.th/images/977cdbb268cddcc84bcbfb3d92f696358dc2d46451f958bb7559466af81b1afe.jpeg	30 วันต่อเมลไมไ่ด้ค่ะ\n\nmicrosoft ของเเท้ เป็นเฟรมครอบครัว		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
79	microsoft 30 วัน ( เมลร้าน )	35	15	12	https://img.rdcw.co.th/images/398091167163606a7e40d367cd0fdd9b238b56157ca224ba4144eefe633b6bb6.jpeg	30 วัน เมลร้านต่อเมลไมไ่ด้ค่ะ\n\nmicrosoft ของเเท้ เป็นเฟรมครอบครัว		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
162	GOOD SHORT 7 DAY	260	240	235	https://img.rdcw.co.th/images/51cbc7ae6fb3a0d36f8d6736c00ecd8613932dc8874eb22e1b1f23fd977fd5c6.jpeg	GOOD SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
42	MAX STANDARD 30 วัน ÷4	70	45	40	https://img.rdcw.co.th/images/e563ae9b54eae0512756a9ff6088fab5ef51c63f30efcf2772f880a6b74e533c.png	▶️ HBO MAX แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO MAX แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.337	2025-10-07 03:49:05.337
70	MAIL GOOGLE (ขึ้นเเพ็ค YouTube)	25	22	20	https://img.rdcw.co.th/images/31dbb1adfc0a376ebadaabad5d5c042f479b2f62d3f978261bd46963fda5d04b.jpeg	เมลเปล่า ไม่ผ่านการใช้งาน สำหรับทำ ยูทูป เเละแอพอื่นๆได้\n\nเมลใหม่ ไม่ติดเบอร์ ไม่ติดยืนยัน \n\nรับเคลม 10 ชม		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
149	DRAMA BOX 3 DAY	85	65	63	https://img.rdcw.co.th/images/1f77a822c50e68f5fab168d8d515f9d85db3fe34e45d228b0e448690b13d3796.jpeg	DRAMA BOX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
152	DRAMA WAVE 1 DAY	50	35	33	https://img.rdcw.co.th/images/864f2901e19bab17d3a6a25fa9eef1a8a2430b75c43531f273122204af7379a7.jpeg	DRAMA WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
151	DRAMA WAVE ตัด 00.00 	35	29	27	https://img.rdcw.co.th/images/e13567ef7f9c88d2591673515ea60e85a02502a71df153c97f4d90532d43c428.jpeg	DRAMA WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
153	DRAMA WAVE 3 DAY	70	50	48	https://img.rdcw.co.th/images/c684f448d343176a3863ccd92bc36a2b479c116ca7ecc05bbe2fd51a90c496e8.jpeg	DRAMA WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
154	DRAMA WAVE 7 DAY	125	100	95	https://img.rdcw.co.th/images/0b4b4df0c40600a8dcb07d1377ec5dc191287a9c08c010f8fdf951ecebd171fd.jpeg	DRAMA WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
156	KALOS TV 1 DAY	85	55	53	https://img.rdcw.co.th/images/3162125c7a344eabb23684a2bb9aa24657ba16945ceaf201603aee7fe9ad8213.jpeg	KALOS TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
159	GOOD SHORT ตัด 00.00 	35	29	27	https://img.rdcw.co.th/images/92c1d24e66c5d37fdb352b01824b7137fb55ece680b5d7155ccf00ee6008b27e.jpeg	GOOD SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
41	MAX STANDARD 30 วัน ÷3	85	55	50	https://img.rdcw.co.th/images/316f6b6dff11b3cad22053ab4fee08773ac06ba462edff3184773ebf3f5f2167.png	▶️ HBO MAX แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO MAX แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
8	✨แอคนอกมีเคลม NF 7 วัน (มือถือ) 	50	32	30	https://img.rdcw.co.th/images/4456131c877a1e1d6a0718ea6a9ac1f07bd7440a995834fe6b0bc8e022404c99.png	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.335	2025-10-07 03:49:05.335
17	YouTube 30 DAYS (ไม่ต่อ เมลร้าน) 	40	25	23	https://img.rdcw.co.th/images/1de3e23bb3059314554fe7a45ffe95270ef620a0ec1510c91097668b72b83e5e.png	⏰ วันใช้งาน 30 วัน\n❌ ไม่ต่ออายุใช้งาน( 1 เมล์เข้าได้ 2 รอบ )\n➢ รับชมแบบไม่มีโฆษณา\n➢ ฟังเพลงปิดหน้าจอได้ ..\n✔️ เมลร้าน\n❌ ไม่รับเคลมหากโดนปิด ติดยืนยัน		t	2025-10-07 03:49:05.336	2025-10-07 03:49:05.336
50	Bilibili 15 วัน ( จอหาร )	35	12	10	https://img.rdcw.co.th/images/0204028419077a27a108389385fc0e619a3ad7791e02e6ef7e0ad2f1c2605b6b.png	▶️ Bilibili แอปดูการ์ตูนอนิเมะ<span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ Bilibili แพ็กเกจ  <span class="badge bg-warning">Premium รายเดือน</span></h6>  <li>website <a href="https://www.bilibili.tv/th" target="_blank">https://www.bilibili.tv/th</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
55	YOUKU VIP 80 วัน (จอหาร)	85	55	52	https://img.rdcw.co.th/images/423b528bcf3d18994cc11a8f33c6f4a06b83d1b04d4578445e320c02ecbfb0a2.png	▶️ YOUKU แอปดูหนัง/ซีรีย์ <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>  \n▶️ รับชม YOUKU Premium แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ YOUKU Premiumแพ็กเกจ  <span class="badge bg-warning">รายเดือน</span></h6>  <li>website <a href="https://youku.tv/" target="_blank">https://youku.tv/</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
54	Bilibili 30 วัน ( mail/pass )	110	85	80	https://img.rdcw.co.th/images/1a19fdc89e52cb4840902fe8b298a4d5d84da9c77f1477c697f5647a4e09f29d.png	▶️ Bilibili แอปดูการ์ตูนอนิเมะ<span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ Bilibili แพ็กเกจ  <span class="badge bg-warning">Premium รายเดือน</span></h6>  <li>website <a href="https://www.bilibili.tv/th" target="_blank">https://www.bilibili.tv/th</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
63	TrueID+ 15 วัน ( จอหาร )	25	12	10	https://img.rdcw.co.th/images/fc4aa60a79671063cf447e4cdd5d4f2a59e72e9298bae94ccc6f8e399e654a9f.jpeg	▶️ TrueID แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน/TVออนไลน์<span class="badge bg-dark "></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ รับชม TrueID+ แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Phone/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ TrueID แพ็กเกจ  <span class="badge bg-warning">TrueID+ รายเดือน</span></h6>  <li>website <a href="https://www.trueid.net/watch/th-th/trueidplus" target="_blank">https://www.trueid.net/watch/th-th/trueidplus</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
72	API TEST	0	0	0	https://img.rdcw.co.th/images/20e397f914a7d8c0f16ddf8fd1034e131deca4ab1fe1f8074a19297144d5505b.png	ทดสอบการสั่งซื้อด้วย API		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
56	YOUKU VIP 90 วัน (จอหาร) ÷3	105	80	78	https://img.rdcw.co.th/images/572fba3c4f2b0974f7a5fbd15e3c62533657350d6c064b63af69ff81b7e5eecb.png	▶️ YOUKU แอปดูหนัง/ซีรีย์ <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>  \n▶️ รับชม YOUKU Premium แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ YOUKU Premiumแพ็กเกจ  <span class="badge bg-warning">รายเดือน</span></h6>  <li>website <a href="https://youku.tv/" target="_blank">https://youku.tv/</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
60	Spotify Premium 60 วัน (เมลร้าน)	80	60	55	https://img.rdcw.co.th/images/ab70b295c60995fd7a1095d88a35d4d20e88e8e2fbb391c223e7159a248d6fc0.png	▶️ Spotify แอปฟังเพลงออนไลน์ รวมเพลงทุกประเทศ\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> ระดับพรีเมียม</span>\n▶️ ฟังเพลงขนาดปิดหน้าจอไม่มีโฆษณากวนใจ\n▶️ โหลดเพลงไว้ฟังขนาดออฟไลน์ได้\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ Spotify แพ็กเกจ <span class="badge bg-warning">รายเดือน</span\n <li>website <a href="https://open.spotify.com/" target="_blank">https://open.spotify.com/</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
73	TEST LINE OA	1	1	1	https://superhog-apim.developer.azure-api.net/content/926f6aaba773.png	เทส		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
88	Disney+ 1วัน (จอส่วนตัว)	30	22	22	https://img.rdcw.co.th/images/fb505e112b4ce254cc19f0fcc9984126d974b210b92b080bf845afa1b79bcba6.jpeg	▶️ Disney+ แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD 4K</span> \n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i>\n▶️ จะได้รับเป็น Phone/OTP เข้าใช้งานได้ทันที \n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)\n▶️ Disney แพ็กเกจ <span class="badge bg-warning">รายเดือน</span>    \n<li>website <a href="https://www.hotstar.com/th" target="_blank">https://www.hotstar.com/th</a></li>		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
87	❣️แอคไทยเคลม  NF 30 วัน (จอเสริม) 	165	145	140	https://img.rdcw.co.th/images/e5ed22ad91b1059ef83da9a59abd2904959094d6d6dd4774be5c80084daa30fb.jpeg	✔️ สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (เข้าได้หลายอุปกรณ์ได้)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n✔️ เคลมหากโดนปิดบัญชี (ระยะประกัน 15 วัน) \n✔️ เคลมเป็นแอคนอก TV เท่านั้น		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
81	✨แอคนอกมีเคลม NF 10 วัน (TV) 	75	55	50	https://img.rdcw.co.th/images/79ab81e33f9315343171371e0c6965e58eb262bb0f83ca051868bbca9b679191.jpeg	✔️ สามารถชมผ่านทีวีได้ \n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
80	✨แอคนอกมีเคลม NF 10 วัน (มือถือ) 	65	45	40	https://img.rdcw.co.th/images/11efa0aacba34659468a56c8eab3cf804424c5136326d25d65706f15590cdacf.jpeg	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
65	TrueID+ 30 วัน ÷4	35	22	20	https://img.rdcw.co.th/images/0fbe0a0495c64639c128ffa960b5450c851339353ad2a405966efc986a71d328.jpeg	▶️ TrueID แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน/TVออนไลน์<span class="badge bg-dark "></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ รับชม TrueID+ แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Phone/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ TrueID แพ็กเกจ  <span class="badge bg-warning">TrueID+ รายเดือน</span></h6>  <li>website <a href="https://www.trueid.net/watch/th-th/trueidplus" target="_blank">https://www.trueid.net/watch/th-th/trueidplus</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
67	CH 3 Plus 30 วัน ÷2	55	39	39	https://img.rdcw.co.th/images/ebd2c89f67c8bd7624e6753b0f50592649e3a9d434eacd959e72d743bb82247c.jpeg	▶️ CH3 Plus แอปดูภาพยนตร์ / ซีรีส์ / ละคร การ์ตูน / ข่าวสด ย้อนหลัง <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ CH3 Plus แพ็กเกจ  <span class="badge bg-warning">Premium รายเดือน</span></h6>  <li>website <a href="https://ch3plus.com/" target="_blank">https://ch3plus.com/</a></li> 		t	2025-10-07 03:49:05.338	2025-10-07 03:49:05.338
82	Netflix 10 วัน (จอเสริม) 	85	65	60	https://img.rdcw.co.th/images/7d14acb605fb55fd40c3f21dc72e2b63738769632f6d1314f3bb8eaedb2885bd.jpeg	จอเสริม = เมลส่วนตัว (1เมล/1คน) \n\n✔️ สามารถรับชมได้ทุกอุปกรณ์ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถเข้าได้มากกว่า 1 เครื่อง\n✔️ ความละเอียดระดับ UltraHD 4K \n✔️ เคลมหากโดนปิดบัญชี (ระยะประกัน 7 วัน)		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
89	Disney+ 7วัน (จอส่วนตัว) ÷4	70	45	45	https://img.rdcw.co.th/images/9e4e842d0cbcc6311da21e046c7832d325e86acf03ba1d3979896409a5c62788.jpeg	▶️ Disney+ แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD 4K</span> \n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i>\n▶️ จะได้รับเป็น Phone/OTP เข้าใช้งานได้ทันที \n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)\n▶️ Disney แพ็กเกจ <span class="badge bg-warning">รายเดือน</span>    \n<li>website <a href="https://www.hotstar.com/th" target="_blank">https://www.hotstar.com/th</a></li>		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
90	Disney+ 7วัน (จอส่วนตัว) ÷5	55	40	40	https://img.rdcw.co.th/images/13e6b84870ccb85b6d114e3cb966330d7cc5067c94c3b6ca85a8c6052e682be2.jpeg	▶️ Disney+ แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD 4K</span> \n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i>\n▶️ จะได้รับเป็น Phone/OTP เข้าใช้งานได้ทันที \n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)\n▶️ Disney แพ็กเกจ <span class="badge bg-warning">รายเดือน</span>    \n<li>website <a href="https://www.hotstar.com/th" target="_blank">https://www.hotstar.com/th</a></li>		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
100	IQIYI Gold 30 วัน (เเพ็ค 4K) ÷5	50	27	25	https://img.rdcw.co.th/images/906c9feeda8067ca67e760592c5686bc9ff7a84af6bfde5966949ca49da7c3d3.jpeg	• IQIY Gold Standard ( แชร์ 5 )  \n • รับชมได้ 1 จอ  สามารถรับชมได้พร้อมกันแค่ 4 จอ \n • หากจอชนต้องรอเท่านั้น\n • ความละเอียดระดับ 4K  \n •  ไม่สามารถเปลี่ยนข้อมูลได้   		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
85	✨แอคนอกมีเคลม NF 30 วัน (มือถือ) 	115	90	85	https://img.rdcw.co.th/images/a404f02649444bd98e1638cfbb77653d0b8976b4e6f7a60cd9863c03900a2c59.jpeg	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
91	Disney+ 30วัน (จอส่วนตัว) ÷4	129	100	100	https://img.rdcw.co.th/images/9a7f64b101b86d63155608a7875864d644550a06cc1f68fdc3ca5780455b22ec.jpeg	▶️ Disney+ แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD 4K</span> \n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i>\n▶️ จะได้รับเป็น Phone/OTP เข้าใช้งานได้ทันที \n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)\n▶️ Disney แพ็กเกจ <span class="badge bg-warning">รายเดือน</span>    \n<li>website <a href="https://www.hotstar.com/th" target="_blank">https://www.hotstar.com/th</a></li>		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
99	IQIYI Gold 30 วัน (เเพ็ค 4K) ÷4	55	35	33	https://img.rdcw.co.th/images/6cce254c17b4c554bf8ec1bda60dc018a1b14e023ed588e51d4ae7d9f8ac9db8.jpeg	 • IQIY Gold Standard ( แชร์ 4 )  \n • รับชมได้ 1 จอ  สามารถรับชมได้พร้อมกันแค่ 4 จอ \n • หากจอชนต้องรอเท่านั้น\n • ความละเอียดระดับ 4K  \n •  ไม่สามารถเปลี่ยนข้อมูลได้   		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
92	Disney+ 30วัน (จอส่วนตัว) ÷5	109	85	85	https://img.rdcw.co.th/images/84b84a9c07a7a267b6ec6131d48eb344619797ab13d3e4edba071dd61a397f63.jpeg	▶️ Disney+ แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD 4K</span> \n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i>\n▶️ จะได้รับเป็น Phone/OTP เข้าใช้งานได้ทันที \n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)\n▶️ Disney แพ็กเกจ <span class="badge bg-warning">รายเดือน</span>    \n<li>website <a href="https://www.hotstar.com/th" target="_blank">https://www.hotstar.com/th</a></li>		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
97	ONE D 30 DAY	55	42	39	https://img.rdcw.co.th/images/57a282e2936b1dfb4efa1ca7242353c627701a31f50cc72c553fe69fc14d9b23.jpeg	<h3><u>รายละเอียด</u></h3>  <h6>▶️ oneD แอปดูภาพยนตร์ / ซีรีส์ / ละคร การ์ตูน / ข่าวสด ย้อนหลัง <span class=\\"badge bg-dark\\"></h6>  <h6>▶️ Soundเสียง <span class=\\"text-light badge bg-dark\\"><i class=\\"fa fa-volume-up\\" aria-hidden=\\"true\\"></i> พากย์ไทย/ซับไทย</span></h6> <h6>▶️ ความชัดระดับ <span class=\\"text-light badge bg-dark\\">Full HD</span></h6>  <h6>▶️ สามารถรับชมจำนวน 1จอ <i class=\\"fa fa-desktop\\" aria-hidden=\\"true\\"></i> <h6>▶️ รับชม oneD แบบไม่มีโฆษณาคั่น</h6><h6>▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที</h6>  <h6>▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i></h6>  <h6>▶️ CH3 Plus แพ็กเกจ  <span class=\\"badge bg-warning\\">Premium รายเดือน</span></h6>  <li>website <a href=\\"https://www.oned.net/\\" target=\\"_blank\\">https://www.oned.net/</a></li>		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
106	CAPCUT PRO 7 วัน ÷4	45	25	23	https://img.rdcw.co.th/images/98af185bbc4fd2dde6c3dc956a94d08cd3c0277e20c3de4bb770c2cf8d8819b2.jpeg	เเอคหาร 4 คน ล็อคอินได้คนละ 1 อุปกรณ์\n\nเมลร้านกด ???? คลิปได้เลย ❗️\n❌ ไม่ต้องอัพโหลด ⚠️จะไม่เห็นงานกัน\nถ้ากดอัพโหลดคนที่หารด้วยจะเห็นงานเรา ✅\n\nวิธีเข้าใช้งาน ?\n1. ล็อคอินผ่าน เมล-พาส เข้าทางเมลในเเอพ\n2. ✂️เข้าเกิน 1 อุปกรณ์ปรับ 200฿		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
107	CAPCUT PRO 15 วัน ÷2	100	80	75	https://img.rdcw.co.th/images/f68ef3e1a988942f5e35706c49eaba1873b3c1f3bdf204a3b1d3a86742bedf73.jpeg	เเอคหาร 2 คน ล็อคอินได้คนละ 1 อุปกรณ์\n\nเมลร้านกด ???? คลิปได้เลย ❗️\n❌ ไม่ต้องอัพโหลด ⚠️จะไม่เห็นงานกัน\nถ้ากดอัพโหลดคนที่หารด้วยจะเห็นงานเรา ✅\n\nวิธีเข้าใช้งาน ?\n1. ล็อคอินผ่าน เมล-พาส เข้าทางเมลในเเอพ\n2. ✂️เข้าเกิน 1 อุปกรณ์ปรับ 200฿		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
108	CAPCUT PRO 15 วัน ÷4	65	40	35	https://img.rdcw.co.th/images/94c9298e5fe0bb515d5a6d714ae18cb7987b1d1b6070eb7df2244645b1ca28e2.jpeg	เเอคหาร 4 คน ล็อคอินได้คนละ 1 อุปกรณ์\n\nเมลร้านกด ???? คลิปได้เลย ❗️\n❌ ไม่ต้องอัพโหลด ⚠️จะไม่เห็นงานกัน\nถ้ากดอัพโหลดคนที่หารด้วยจะเห็นงานเรา ✅\n\nวิธีเข้าใช้งาน ?\n1. ล็อคอินผ่าน เมล-พาส เข้าทางเมลในเเอพ\n2. ✂️เข้าเกิน 1 อุปกรณ์ปรับ 200฿		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
109	CAPCUT PRO 30 วัน ÷2	180	150	145	https://img.rdcw.co.th/images/1418bf03fea78f1c575e93eedd85f57b2f293b82671223a71f6d0aff55c3537b.jpeg	เเอคหาร 2 คน ล็อคอินได้คนละ 1 อุปกรณ์\n\nเมลร้านกด ???? คลิปได้เลย ❗️\n❌ ไม่ต้องอัพโหลด ⚠️จะไม่เห็นงานกัน\nถ้ากดอัพโหลดคนที่หารด้วยจะเห็นงานเรา ✅\n\nวิธีเข้าใช้งาน ?\n1. ล็อคอินผ่าน เมล-พาส เข้าทางเมลในเเอพ\n2. ✂️เข้าเกิน 1 อุปกรณ์ปรับ 200฿		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
86	✨แอคนอกมีเคลม NF 30 วัน (TV) 	135	119	110	https://img.rdcw.co.th/images/785161ce7f3a11791012ad4496f0846391a068f93080d7f91468e0570fa0a2f2.jpeg	✔️ สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.339	2025-10-07 03:49:05.339
101	✨แอคนอกมีเคลม NF 7 วัน (มือถือ) ÷4	55	42	40	https://img.rdcw.co.th/images/d24be344bc14aab538d047a3051573e139b82d901cfe7a7bbb47a460ec94e0b3.jpeg	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
105	CAPCUT PRO 7 วัน ÷2	70	50	45	https://img.rdcw.co.th/images/8b2bd050e7623848f9d2f4a0c5fc8256cd7812d9d4e3fb988d4ad2667182641b.jpeg	เเอคหาร 2 คน ล็อคอินได้คนละ 1 อุปกรณ์\n\nเมลร้านกด ???? คลิปได้เลย ❗️\n❌ ไม่ต้องอัพโหลด ⚠️จะไม่เห็นงานกัน\nถ้ากดอัพโหลดคนที่หารด้วยจะเห็นงานเรา ✅\n\nวิธีเข้าใช้งาน ?\n1. ล็อคอินผ่าน เมล-พาส เข้าทางเมลในเเอพ\n2. ✂️เข้าเกิน 1 อุปกรณ์ปรับ 200฿		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
104	✨แอคนอกมีเคลม NF 30 วัน (TV) ÷4	150	135	130	https://img.rdcw.co.th/images/5f909be96e6f00b2df1c349abd6ed49de6778a18b50a12bf6632528480d0dd69.jpeg	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
102	✨แอคนอกมีเคลม NF 7 วัน (TV) ÷4	70	55	52	https://img.rdcw.co.th/images/2ea4bc17204bf661387f9bf23d0f7e2b9441d6ff97c9802b4585cd241b1fc4f5.jpeg	✔️ สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
103	✨แอคนอกมีเคลม NF 30 วัน (มือถือ)  ÷4	130	110	105	https://img.rdcw.co.th/images/a003dae2a62b01e5fabe9a9854be8d077a7c9ee263baecf6d8d36df4845241d2.jpeg	❌ ไม่สามารถรับชมผ่านทีวีได้\n❌ ห้ามฝ่าฝืนกฎหรือสลับอุปกรณ์ หากทำผิดขอยึดสิทธิ์ทันที\n✔️ สามารถเปลี่ยนชื่อโปรไฟล์และ PIN ได้\n✔️ บัญชีต่างประเทศ (International Account) 100%\n✔️ รับชมได้ 1 อุปกรณ์เท่านั้น (ห้ามสลับเครื่องหรือแชร์)\n✔️ ความละเอียดระดับ Ultra HD / 4K\n✔️ 00.00 1 3 วันรับเคลมตลอดการใช้งาน (รอเคลม 12-24 ชั่วโมง)\n✔️ 7(ประกัน 5 วัน) 30(ประกัน 15 วัน) เคลมตามวันที่เหลือ\n\n⚠️ กรุณารอตามเวลาที่แจ้ง ขอคนรับความเสี่ยงได้เท่านั้น ห้ามเหวี่ยงหรือวีน\n\nข้อเเตกต่าง\nแอคนอก                                        แอคไทย          \n-ตัดสกุลเงินต่างประเทศ              -ตัดเงินไทย\n-เปลี่ยนได้หลายภาษา                   -มีเมนูไทย\n\nปัญหาที่จะพบ \n1. มีความเสี่ยงในการโดนปิดเหมือนแอคไทย\n2. มีการรีรหัสโดยระบบ ซึ่งจะต้องรอเเก้ภายใน 24-48 ชม. เเละต้องรอ ห้ามเหวี่ยงห้ามวีน\n3. ประกันการใช้งาน เคลม 1 ครั้งหากโดนปิด 		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
163	SHOT SHORT ตัด 00.00 	35	29	27	https://img.rdcw.co.th/images/36fa2135232913df1fdd69d94c9317e7128a90ecd94cdca0d8556db3c17f905a.jpeg	SHOT SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
120	MAX UNLIMITED (4K) 7 วัน ÷4	45	30	28	https://img.rdcw.co.th/images/efb04ae7d40392f7ce38cef958903f0f2f4067ea81a7a1018d439af326e50d0a.jpeg	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
122	MAX UNLIMITED (4K) 15 วัน 	60	48	45	https://img.rdcw.co.th/images/054d89c05af884ee5f3bd020c7fa27e7a7312b87ad838e6352cb5d79e3cde85e.jpeg	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
126	MAX UNLIMITED (4K) 30 วัน ส่วนตัว ÷5	105	70	65	https://img.rdcw.co.th/images/6aa155c1568eebfb07913349ffe28da1769939eef710469cf4e2a0288eb403f4.jpeg	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
143	SHORT MAX ตัด 00.00 	30	20	18	https://img.rdcw.co.th/images/bb69a59200b8712f76f564ed3752278ea2f91f9480151f8dd3c2e4ede8de252d.jpeg	SHORT MAX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
127	MAX UNLIMITED (4K) 30 วัน จอหาร	65	45	40	https://img.rdcw.co.th/images/58cfee8229818f40db048dc0f20907a6aac5e6a88a9fa68df29f8788504b7ee3.jpeg	▶️ จอหาร 1 จอ / 2 คน\n▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
144	SHORT MAX 1 DAY	45	30	28	https://img.rdcw.co.th/images/dcab8e650e125ba9a54224f9354321a586b8dd087b876559cf0bb6c1b8eb262a.jpeg	SHORT MAX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
148	DRAMA BOX 1 DAY	50	35	33	https://img.rdcw.co.th/images/a08571acc62f6a2b5fa7b70cf30515a5c51b6886c35b6e8018c4733de9784661.jpeg	DRAMA BOX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
121	MAX UNLIMITED (4K) 7 วัน ÷5	40	25	23	https://img.rdcw.co.th/images/0fa529eb122566e1027259bf024ba04332dd8d25720a767226d8ba6b250743d5.jpeg	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.34	2025-10-07 03:49:05.34
123	MAX UNLIMITED (4K) 25 วัน	85	62	60	https://img.rdcw.co.th/images/3f46780dd5425d4e2b8d81ca5d40e6eb4dc12cf8362f959ac9d183f2ce54d495.jpeg	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
124	MAX UNLIMITED (4K) 25 วัน จอหาร	50	35	30	https://img.rdcw.co.th/images/dec146c1be460d489c17cb4cb7a0cc0522ff13fcb5f6f42c21037e0120c5af8a.jpeg	▶️ จอหาร 1 จอ / 2 คน\n▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
146	SHORT MAX 7 DAY	145	120	115	https://img.rdcw.co.th/images/f639c4c98ebb7af062169c4ea386e3bc34a54b0bb3e468bd6c5ebaef7f7a49f3.jpeg	SHORT MAX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
150	DRAMA BOX 7 DAY	165	130	125	https://img.rdcw.co.th/images/a96a762fa7d27c5cbffac4f9d5a8321a233b3f0743a6804404234e7bbc2034cb.jpeg	DRAMA BOX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
157	KALOS TV 3 DAY	125	85	83	https://img.rdcw.co.th/images/68a4bb7003d2681e46b79637ccaed88ac3526ee67996704f594434edf92fd410.jpeg	KALOS TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
155	KALOS TV ตัด 00.00 	50	35	33	https://img.rdcw.co.th/images/6e5c6b6de9615b11f097c1e8e0207692615e01aa05b1bf6e3d554e2bf009b5a2.jpeg	KALOS TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
158	KALOS TV 7 DAY	220	180	175	https://img.rdcw.co.th/images/df6ee2e157c38a36f3a7fae464f8e2fc6ef35054ee4ab8fb53d01bc33930b56a.jpeg	KALOS TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
125	MAX UNLIMITED (4K) 30 วัน ส่วนตัว ÷4	115	85	80	https://img.rdcw.co.th/images/b5b853c15ad56439c1d65700a6f28066bcf21104f6f65825c450ad1d29072dfc.jpeg	▶️ HBO GO แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">4K</span>\n▶️ สามารถรับชมจำนวน 1 จอ <i class="fa fa-desktop" aria-hidden="true"></i> \n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ HBO GO แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.hbogo.co.th/" target="_blank">https://www.hbogo.co.th/</a></li> 		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
145	SHORT MAX 3 DAY	85	60	58	https://img.rdcw.co.th/images/0ea079a7eea7ad3555201c9036ad812fec011af132cdd6a66c7d487f95e50ad4.jpeg	SHORT MAX\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.341	2025-10-07 03:49:05.341
160	GOOD SHORT 1 DAY	50	35	33	https://img.rdcw.co.th/images/4ae6e67b091c2d05b3189db63b2f6268c7f8c54eac626aac98b1c12b584312b4.jpeg	GOOD SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
166	SHOT SHORT 7 DAY	170	135	130	https://img.rdcw.co.th/images/033a8a383ec7c1d2f7f0eb6caa556cf553a14b126e569968f9f0b206748aef96.jpeg	SHOT SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
170	REEL SHORT 7 DAY	165	130	125	https://img.rdcw.co.th/images/80495f574b33059a4ed9e7e10996b2809a7263c495aeffe10fcc0f037935dd6e.jpeg	REEL SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
184	MOBOREELS VIP 3 DAY	125	95	93	https://img.rdcw.co.th/images/2c42ca814b5b553b961d9290808c375b4482c928565f8ee8598b1251268c8cd4.jpeg	MOBOREELS VIP\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
185	MOBOREELS VIP 7 DAY	210	185	180	https://img.rdcw.co.th/images/e84d28285d37c9768bc8761252ebe9a29c5566afc7fbe07d548e4c133915a433.jpeg	MOBOREELS VIP\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
188	STARDUST TV 3 DAY	125	95	93	https://img.rdcw.co.th/images/ebb7e8812546cf798258889870ca915cc66d44dd5a06eab20c8e8a131275b0b2.jpeg	STARDUST TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
164	SHOT SHORT 1 DAY	55	45	43	https://img.rdcw.co.th/images/47220523bd1159669aa2f9312f874eabe8bb35bdf88b68204d584564df21bfdd.jpeg	SHOT SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
168	REEL SHORT 1 DAY	55	40	38	https://img.rdcw.co.th/images/47031d4fb6102d19b03822bd80e6aca025b6563bb2d64aaf3a4929c796bd74f6.jpeg	REEL SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
182	MOBOREELS VIP ตัด 00.00	50	35	33	https://img.rdcw.co.th/images/843873fff29e019a33f9895b0e7c7535dcbf6bd6a40df1b408a9a21ad550908a.jpeg	MOBOREELS VIP\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
183	MOBOREELS VIP 1 DAY	85	65	63	https://img.rdcw.co.th/images/df6f9cb82ab958344047826a80542cf47819fad7a2a99c5f163ace8e2f4962a0.jpeg	MOBOREELS VIP\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
186	STARDUST TV ตัด 00.00 	50	35	33	https://img.rdcw.co.th/images/2625eb70798ee102d26cdad6c4541631631212c3866c163139028894cd9ea487.jpeg	STARDUST TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
187	STARDUST TV 1 DAY	85	65	63	https://img.rdcw.co.th/images/539118563144b527dad5753fc4ce6d7e6daa7ddea1b3ce066a44d2fb2886435a.jpeg	STARDUST TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
189	STARDUST TV 7 DAY	210	185	180	https://img.rdcw.co.th/images/3e0d28f57a94e10631d15becada722c1564401f4355e24183b41aff72a2892d0.jpeg	STARDUST TV\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
192	SHORT WAVE 3 DAY	90	70	68	https://img.rdcw.co.th/images/76f1680acd0b0810caf0358f6d17647700e0732fab6e294b690c59f6b2ee214e.jpeg	SHORT WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
165	SHOT SHORT 3 DAY	115	85	83	https://img.rdcw.co.th/images/638470bfa09dc83c69eb97e0a468edca8a215c8f7f3103794c5c2f5b20741139.jpeg	SHOT SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
167	REEL SHORT ตัด 00.00 	35	29	27	https://img.rdcw.co.th/images/be44bfdf63b3aa50eb751d1710e92cbd735805e3290e8280c09f37af0c134266.jpeg	REEL SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-07 03:49:05.342
169	REEL SHORT 3 DAY	90	70	68	https://img.rdcw.co.th/images/ece5643646d51723e36f5b2d314371b2b0d02aa2f603ffb88770ff3e5f530b64.jpeg	REEL SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
195	NET SHORT 3 DAY	280	250	245	https://img.rdcw.co.th/images/f6e69f0cffe3bd30778463332b4738a07ed018ad987eca98c73504845116d6cd.jpeg	NET SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
201	MONOMAX1อุปกรณ์ 20 วัน (จอหาร)	50	30	30	https://img.rdcw.co.th/images/81aaaa55da7e6f3e9e6275516772ae1abef43648d29dcae13ef9a8ef96cc3d53.jpeg	▶️ MONOMAX แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย</span>\n▶️ ความชัดระดับ <span class="badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></I>\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ MONOMAX แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.monomax.me/" target="_blank">https://www.monomax.me/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
203	MONOMAX1อุปกรณ์ 30 วัน (จอหาร)	85	65	58	https://img.rdcw.co.th/images/3720d262dc308dd22191814cbf14c0b007a2df7ef1c84a12807922db5520feb5.jpeg	▶️ MONOMAX แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย</span>\n▶️ ความชัดระดับ <span class="badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></I>\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ MONOMAX แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.monomax.me/" target="_blank">https://www.monomax.me/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
202	MONOMAX1อุปกรณ์ 30 วัน (จอส่วนตัว)	135	115	110	https://img.rdcw.co.th/images/2e522cbdbc127b027ec6681d75704322fc9429e85b24a6bd92ae43d1c9f5f6fa.jpeg	▶️ MONOMAX แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย</span>\n▶️ ความชัดระดับ <span class="badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></I>\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ MONOMAX แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.monomax.me/" target="_blank">https://www.monomax.me/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
204	MONOMAX1อุปกรณ์ 30 วัน REDEEM	95	75	75	https://img.rdcw.co.th/images/16086b96e77f9e7ca6076ca0c3bf36672772a8960eba65d54f17c926887473fc.jpeg	▶️ อป = 1 อุปกรณ์\n▶️ MONOMAX แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย</span>\n▶️ ความชัดระดับ <span class="badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></I>\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ MONOMAX แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.monomax.me/" target="_blank">https://www.monomax.me/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
206	YOUKU VIP 30 วัน (จอหาร) ÷3	55	25	23	https://img.rdcw.co.th/images/35886228ddbc498dc93e29a5a08620010fe5cdae6c84b152f7fca81b746b7a88.jpeg	▶️ YOUKU แอปดูหนัง/ซีรีย์ <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>  \n▶️ รับชม YOUKU Premium แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ YOUKU Premiumแพ็กเกจ  <span class="badge bg-warning">รายเดือน</span></h6>  <li>website <a href="https://youku.tv/" target="_blank">https://youku.tv/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
190	SHORT WAVE ตัด 00.00 	35	29	27	https://img.rdcw.co.th/images/7502b5434d630d7673cd7e43bb4c328e2f45de38bcb4cbbf1e9a8ef43a9ad63c.jpeg	SHORT WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.343	2025-10-07 03:49:05.343
194	NET SHORT 7 DAY	380	350	345	https://img.rdcw.co.th/images/cfa9746e032cf5fcfbe7b7af0570e4692e2ac9bfe55ed29d0ec66e5994c1f875.jpeg	NET SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
191	SHORT WAVE 1 DAY	50	35	33	https://img.rdcw.co.th/images/3f64ca7bbb43913a07edaa5faaa47130d7a75c855d5bfba25d8c215f5bbb4187.jpeg	SHORT WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
193	SHORT WAVE 7 DAY	170	135	130	https://img.rdcw.co.th/images/93b62c8066383838868bd88e46f685edbd4b6b14e93348bd9a46a9441cc09cbd.jpeg	SHORT WAVE\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
199	FLEXTV 7 DAY	180	145	140	https://img.rdcw.co.th/images/0409caa4df1bf3ade71e3db9c37de24076f9f11a0ce1d98b8b5b28ad6044e4fa.jpeg	FLEXTV \n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
196	FLEXTV ตัด 00.00 	50	35	33	https://img.rdcw.co.th/images/c77632f2fff1c678665795a4d9149ca30ef5a7eba9114fdc733d8ca0522780de.jpeg	FLEXTV \n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
198	FLEXTV 3 DAY	115	85	83	https://img.rdcw.co.th/images/7cde663dd02be4328b0289b527e6355c7a9a2e3dc59161c7597fc735fae7d037.jpeg	FLEXTV \n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
200	MONOMAX1อุปกรณ์ 20 วัน (จอส่วนตัว)	85	65	65	https://img.rdcw.co.th/images/2ec9c746770f15fe4e9a8a4a85b2962a1935906f36a66698b70ebd88125c2bc3.jpeg	▶️ MONOMAX แอปดูหนังภาพยนตร์/ซีรีย์/การ์ตูน <span class="text-light badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย</span>\n▶️ ความชัดระดับ <span class="badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></I>\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ MONOMAX แพ็กเกจ  <span class="badge bg-warning">รายเดือน</span>\n<li>website <a href="https://www.monomax.me/" target="_blank">https://www.monomax.me/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
197	FLEXTV 1 DAY	85	65	63	https://img.rdcw.co.th/images/84b9104804b7b84b831ec804c034c23c7b1fe815b552767d2ec778688c7701ec.jpeg	FLEXTV \n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ เข้าสู่ระบบด้วย google นะคะ\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
209	❣️แอคไทยไม่เคลม NF 1 วัน (มือถือ) 	15	10	9	https://img.rdcw.co.th/images/785c01c8632d8751eb2e9571ff6c1ace5ed2bf86be858b4948a6b8d312278a46.png	❌ ไม่สามารถชมผ่านทีวีได้ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถรับชมได้ 1 จอ ( ห้ามสลับเครื่องไปมา)\n✔️ ความละเอียดระดับ UltraHD 4K \n✔️ ไม่รับเคลมหากโดนปิดบัญชี		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
213	❣️แอคไทยไม่เคลม NF 30 วัน (มือถือ) 	120	95	90	https://img.rdcw.co.th/images/2c511ecb1e2736a8aa3c3d93e555779f32aca7452eb1d5ae5a4bdbd89838db89.png	❌ ไม่สามารถชมผ่านทีวีได้ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถรับชมได้ 1 จอ ( ห้ามสลับเครื่องไปมา)\n✔️ ความละเอียดระดับ UltraHD 4K \n✔️ ไม่รับเคลมหากโดนปิดบัญชี		t	2025-10-07 03:49:05.345	2025-10-07 03:49:05.345
212	❣️แอคไทยไม่เคลม Netflix 7 วัน (TV)	65	45	42	https://zcmnmpp6v3hjmfp6.public.blob.vercel-storage.com/products/212-1759811442428.png	✔️ สามารถชมผ่านทีวีได้ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถรับชมได้ 1 จอ ( ห้ามสลับเครื่องไปมา)\n✔️ ความละเอียดระดับ UltraHD 4K \n✔️ ไม่รับเคลมหากโดนปิดบัญชี		t	2025-10-07 03:49:05.345	2025-10-07 04:30:43.676
207	YOUKU VIP 30 วัน (จอหาร) ÷4	45	18	15	https://img.rdcw.co.th/images/fac79c3fe6a10d14682a68c9d09cd191307fa55cbb4b77a7b9d2d815c1ecb90a.jpeg	▶️ YOUKU แอปดูหนัง/ซีรีย์ <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>  \n▶️ รับชม YOUKU Premium แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ YOUKU Premiumแพ็กเกจ  <span class="badge bg-warning">รายเดือน</span></h6>  <li>website <a href="https://youku.tv/" target="_blank">https://youku.tv/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
208	YOUKU VIP 30 วัน (จอส่วนตัว) 	85	65	65	https://img.rdcw.co.th/images/51b436099cba1d3e5192e08c0e69207688263003ea30a9ad7cd193f23caa66f1.jpeg	▶️ YOUKU แอปดูหนัง/ซีรีย์ <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>  \n▶️ รับชม YOUKU Premium แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ YOUKU Premiumแพ็กเกจ  <span class="badge bg-warning">รายเดือน</span></h6>  <li>website <a href="https://youku.tv/" target="_blank">https://youku.tv/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
205	YOUKU VIP 15 วัน (จอหาร)	25	10	10	https://img.rdcw.co.th/images/487ef2e3cc8fd9aa91ef18510d9c2d379ba45f0a1fa209ce3d0f2551eb51652e.jpeg	▶️ YOUKU แอปดูหนัง/ซีรีย์ <span class="badge bg-dark"></span>\n▶️ Soundเสียง <span class="text-light badge bg-dark"><i class="fa fa-volume-up" aria-hidden="true"></i> พากย์ไทย/ซับไทย</span>\n▶️ ความชัดระดับ <span class="text-light badge bg-dark">Full HD</span>\n▶️ สามารถรับชมจำนวน 1จอ <i class="fa fa-desktop" aria-hidden="true"></i>  \n▶️ รับชม YOUKU Premium แบบไม่มีโฆษณาคั่น\n▶️ จะได้รับเป็น Email/Password เข้าใช้งานได้ทันที\n▶️ รองรับทุกอุปกรณ์ <i>(TV,Com, Ipad ,มือถือ)</i>\n▶️ YOUKU Premiumแพ็กเกจ  <span class="badge bg-warning">รายเดือน</span></h6>  <li>website <a href="https://youku.tv/" target="_blank">https://youku.tv/</a></li> 		t	2025-10-07 03:49:05.344	2025-10-07 03:49:05.344
211	❣️แอคไทยไม่เคลม NF 7 วัน (มือถือ) 	59	35	33	https://img.rdcw.co.th/images/4456131c877a1e1d6a0718ea6a9ac1f07bd7440a995834fe6b0bc8e022404c99.png	❌ ไม่สามารถชมผ่านทีวีได้ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถรับชมได้ 1 จอ ( ห้ามสลับเครื่องไปมา)\n✔️ ความละเอียดระดับ UltraHD 4K \n✔️ ไม่รับเคลมหากโดนปิดบัญชี		t	2025-10-07 03:49:05.345	2025-10-07 03:52:16.26
110	CAPCUT PRO 30 วัน ÷4	112	75	70	https://img.rdcw.co.th/images/abc1d15602127ce0ce39189668443918ac07f0f789f90a3c11bd7058ea2cdedc.jpeg	เเอคหาร 4 คน ล็อคอินได้คนละ 1 อุปกรณ์\n\nเมลร้านกด ???? คลิปได้เลย ❗️\n❌ ไม่ต้องอัพโหลด ⚠️จะไม่เห็นงานกัน\nถ้ากดอัพโหลดคนที่หารด้วยจะเห็นงานเรา ✅\n\nวิธีเข้าใช้งาน ?\n1. ล็อคอินผ่าน เมล-พาส เข้าทางเมลในเเอพ\n2. ✂️เข้าเกิน 1 อุปกรณ์ปรับ 200฿		t	2025-10-07 03:49:05.34	2025-10-07 10:13:00.598
214	❣️แอคไทยไม่เคลม NF 30 วัน (TV) 	140	125	110	https://zcmnmpp6v3hjmfp6.public.blob.vercel-storage.com/products/214-1759811664991.png	✔️ สามารถชมผ่านทีวีได้ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถรับชมได้ 1 จอ ( ห้ามสลับเครื่องไปมา)\n✔️ ความละเอียดระดับ UltraHD 4K \n✔️ ไม่รับเคลมหากโดนปิดบัญชี		t	2025-10-07 03:49:05.345	2025-10-07 04:34:26.939
16	YouTube 30 DAYS  (ไม่ต่อ เมลลูกค้า)	25	12	10	https://img.rdcw.co.th/images/bc7898bb19b16944f0fbbaa25419d016fde129c069727d8090c6ee8df18e3b54.png	⏰ วันใช้งาน 30 วัน\n❌ ไม่ต่ออายุใช้งาน( 1 เมล์เข้าได้ 2 รอบ )\n➢ รับชมแบบไม่มีโฆษณา\n➢ ฟังเพลงปิดหน้าจอได้ ..\n✔️ ใช้เมล์ของลูกค้าเข้าร่วม \n✔️ ได้รับลิ้งค์เข้าร่วมครอบครัว		t	2025-10-07 03:49:05.336	2025-10-22 15:29:39.094
210	❣️แอคไทยไม่เคลม Netflix 1 วัน (TV)	25	15	12	https://img.rdcw.co.th/images/5e88fe4a2fcdc487ec1ebb89a34f049b2ee3520d1ad5b9b784471a2f8de5fb1c.png	✔️ สามารถชมผ่านทีวีได้ \n❌ ห้ามทำผิดกฎหรือมั่วจออื่น หากทำผิดยึดจอทุกกรณี\n✔️ เปลี่ยนชื่อจอและ PIN ได้ \n✔️ แอคเคาท์ไทย 100% \n✔️ สามารถรับชมได้ 1 จอ ( ห้ามสลับเครื่องไปมา)\n✔️ ความละเอียดระดับ UltraHD 4K \n✔️ ไม่รับเคลมหากโดนปิดบัญชี		t	2025-10-07 03:49:05.344	2025-10-22 15:30:07.349
161	GOOD SHORT 3 DAY	180	160	160	https://img.rdcw.co.th/images/9b9f3e83dc8fd62dfd2105e4124834e7b5136336305affd4da694b499982a2e3.jpeg	GOOD SHORT\n(สอบถาม แอด ID : @204ttozz)\n\nซื้อ 1 จอ เข้าได้ 1 อุปกรณ์\n\n♡ ซื้อ 1 คน ต่อ 1 อุปกรณ์\n♡ เข้าได้แล้วแจ้งอุปกรณ์ที่ใช้ด้วยน้า\n♡ แอพเด้งเป็นที่ระบบ ให้รอสักพักเข้าใหม่ ห้ามเข้าถี่แอคล็อคปรับ 500฿\n♡ ห้ามเปลี่ยนรหัสหรือแชร์ต่อรหัสเด็ดขาด ทำผิดปรับ 1,000฿		t	2025-10-07 03:49:05.342	2025-10-27 06:36:07.674
\.


--
-- Data for Name: product_price; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_price (id, "productId", price, "updatedBy", "createdAt", "updatedAt") FROM stdin;
cmgf1qx8x0000iy6lmezmkabt	2	19	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-06 11:27:35.89	2025-10-06 11:28:21.986
cmgg0x7pb0000iycxhabyvvu6	211	59	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-07 03:52:15.935	2025-10-07 03:52:15.935
cmgg0ygtl0002iycxjk0ow46m	110	112	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-07 03:53:14.409	2025-10-07 10:13:00.25
cmgyy17p30000iyblrr4lprvu	16	25	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-20 09:39:01.048	2025-10-22 15:29:38.226
cmh25gfk00001la04vubr5hf1	210	25	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-22 15:30:06.912	2025-10-22 15:30:06.912
cmh8rkykt0000jr04o7ka6qcy	161	180	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-27 06:36:06.797	2025-10-27 06:36:06.797
\.


--
-- Data for Name: purchase_card; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_card (id, amount, paid, status, "beforeBalance", "afterBalance", content, "wepayTxnId", "operatorId", "wepayTxnMessage", "createdAt", "updatedAt", "userId", "cardOptionId") FROM stdin;
f05e898f-6332-4247-a4fa-03e94f83056b	1	20.00	FAILED	490.00	470.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-18 13:10:08.8	2025-11-18 13:10:09.344	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N
e81bb6c9-d02e-45ba-be4f-450d4818745d	1	20.00	FAILED	490.00	470.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-18 13:10:16.69	2025-11-18 13:10:17.129	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N
1f26980c-ee8c-4c70-a17f-727f7935428d	1	20.00	FAILED	490.00	470.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-18 14:43:58.371	2025-11-18 14:43:58.926	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N
6268fe97-895b-4cec-94ef-6443b5f91b7b	1	20.00	FAILED	490.00	470.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-18 14:53:00.879	2025-11-18 14:53:01.383	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N
5f9991e8-029f-40c5-9fde-871afa472a0f	1	20.00	FAILED	490.00	470.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-18 15:14:53.528	2025-11-18 15:14:53.997	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N
99aaa6da-377e-4e8e-80cd-89720180f660	1	20.00	SUCCESS	490.00	470.00	serial_no:755703972,password:9041469587537594	414011368	null	serial_no:755703972,password:9041469587537594	2025-11-18 15:18:30.144	2025-11-18 15:18:34.821	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N
\.


--
-- Data for Name: purchase_game; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_game (id, paid, status, "beforeBalance", "afterBalance", content, "wepayTxnId", "operatorId", "wepayTxnMessage", "createdAt", "updatedAt", "userId", "packageId", "playerId", "serverId", "mixPackageId") FROM stdin;
f389e0ec-5f28-49fa-a6fc-936c67231b85	10.00	PENDING	500.00	490.00	\N	\N	\N	\N	2025-11-17 18:41:53.289	2025-11-17 18:41:53.289	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	34234234234	\N	\N
b3928afa-6987-4347-b219-9a3b9a5fc028	10.00	FAILED	490.00	480.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-17 18:45:27.679	2025-11-17 18:45:28.22	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	23432423423424	\N	\N
9d46d565-7c43-4f94-a6f9-de1edbc460ba	10.00	FAILED	490.00	480.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-17 18:46:49.88	2025-11-17 18:46:50.402	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	324234234234	\N	\N
c2ac69cb-8e5d-46ea-a679-0fdd9cec9cf7	10.00	FAILED	490.00	480.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-17 18:48:05.446	2025-11-17 18:48:05.895	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	2342432	\N	\N
37dfe4fe-144a-4ac8-baad-9e44cc80d3d5	10.00	FAILED	490.00	480.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-17 18:48:47.14	2025-11-17 18:48:47.512	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	3242342343234	\N	\N
bfbc1039-9af9-41ec-b472-d8ee4045249b	10.00	FAILED	490.00	480.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-17 18:53:56.37	2025-11-17 18:53:57	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	3242342343234	\N	\N
141c0372-f9a5-429b-8ee5-1b2f79d37189	10.00	FAILED	490.00	480.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-17 18:54:44.382	2025-11-17 18:54:44.935	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	3242342343234	\N	\N
26bcbd2b-c534-4758-a51a-5285d6c38b20	10.00	FAILED	490.00	480.00	การทำรายการล้มเหลว	414007407	null	ไม่พบ ID ผู้เล่น 3242342343234 ในระบบ (invalid_id)	2025-11-18 12:26:12.103	2025-11-18 12:26:22.059	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	3242342343234	\N	\N
bec191eb-51c5-4b63-b39e-8b11d3f78d78	10.00	FAILED	490.00	480.00	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-18 12:27:32.48	2025-11-18 12:27:34.577	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	0154845416	\N	\N
8bb715f4-c15a-46dd-aec3-83f3bb87cc3c	10.00	FAILED	490.00	480.00	การทำรายการล้มเหลว	414007607	null	ไม่พบ ID ผู้เล่น 0154845416 ในระบบ (invalid_id)	2025-11-18 12:29:21.485	2025-11-18 12:29:29.437	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	0154845416	\N	\N
e24901d8-c64d-49df-a82a-8405b2dddd32	10.00	SUCCESS	470.00	460.00	เติมเงินเกม RoV Mobile ให้กับ 175244799313010 (11 คูปอง) จำนวน 10.00 บาทสำเร็จ TXID:8115363871691096720	414016099	8115363871691096720	เติมเงินเกม RoV Mobile ให้กับ 175244799313010 (11 คูปอง) จำนวน 10.00 บาทสำเร็จ TXID:8115363871691096720	2025-11-18 17:15:10.346	2025-11-18 17:15:19.551	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	\N	175244799313010	\N	\N
c6ad308c-a95a-48e9-a0b8-690712610553	34.50	FAILED	460.00	425.50	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-19 13:39:23.864	2025-11-19 13:39:24.429	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	fd116fac-5f2e-4bd4-bdad-66aecce824bf	32342343324234	da82b15a-fa39-4646-8024-09dda8dc0b38	\N
7f3cc6be-548a-463d-8da1-aa9ec11b6b3b	35.00	FAILED	469.71	434.71	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-19 15:12:46.548	2025-11-19 15:12:47.254	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	93e4eea0-710a-4b4a-a400-c1c3dc1553bf	324324232424324234	4b26c620-7307-4cc5-a6cc-fe8650fa4135	\N
5a0bc04a-40d1-449f-852a-f36015cf6cd4	10.00	FAILED	469.71	459.71	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-19 15:13:10.658	2025-11-19 15:13:11.085	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	1882075f-488c-400d-8b6e-e2514b9d37b1	324324232424324234	\N	\N
276d1c6c-933f-42af-b313-8987c18faf28	10.00	FAILED	469.71	459.71	เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API	\N	\N	\N	2025-11-19 15:14:03.49	2025-11-19 15:14:03.906	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	1882075f-488c-400d-8b6e-e2514b9d37b1	324324232424324234	\N	\N
aa5d42b6-2550-45fc-a2df-a80c42a8c3f2	10.00	SUCCESS	469.71	459.71	เติมเงินเกม RoV Mobile ให้กับ 175244799313010 (11 คูปอง) จำนวน 10.00 บาทสำเร็จ TXID:10754182447555190936	414106441	10754182447555190936	เติมเงินเกม RoV Mobile ให้กับ 175244799313010 (11 คูปอง) จำนวน 10.00 บาทสำเร็จ TXID:10754182447555190936	2025-11-19 15:15:32.795	2025-11-19 15:15:40.801	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	d1122c69-2091-4240-8758-65e57b601c42	175244799313010	\N	\N
\.


--
-- Data for Name: purchase_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_history (id, "userId", "productId", "productName", price, prize, reference, status, "createdAt") FROM stdin;
cmgf22qgw0003iy6l9at0vl9h	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv	2	✨แอคนอกมีเคลม NF 1 วัน (มือถือ) 	19	\\n⏲email : usa-trial6@pbss.club \\n☘pass : uuufff \\n⚱profile : 1 ( เข้า 1 อุปกรณ์ห้ามมั่ว/สลับ ) \\n⚜pin : สามารถตั้งเองได้เลย \\n⌛️exp : 07/10/2025\\n\\n✷เงื่อนไขแบบแอคนอก✷\\nแอคนอก?\\n\\nปัญหาที่จะพบ\\n1. มีความเสี่ยงโดนปิดเหมือนแอคไทย\\n2. ระบบรีรหัส ต้องรอแก้ภายใน 24 ชม. ห้ามเหวี่ยงห้ามวีน\\n3. ร้านประกันปิด 1 ครั้ง\\n\\nรายละเอียดการประกัน\\n☃☃-รายวันเคลมตลอดการใช้งาน\\n♔♔-7 วัน ระยะประกันเคลม (5 วัน)\\n❤❤-30 วัน ระยะประกันเคลม (15 วัน)\\n❀❀-รอเคลม 24-48 ชม. ไม่ทบวัน ถ้าเกิน 48 ชม. ทบ 1 วัน หลังกดซื้อ\\n\\nคำเตือน : ⬪:˵ กฎการใช้งาน ٠ *⑅\\nയ﹆ เข้าได้ เปลี่ยนชื่อจอทันที / ห้ามมั่วจอ ⚠️\\nയ﹆ Netflix ตัดเวลา 22.00 น. ของวันหมดอายุ\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น เข้าเกินปรับ 1,000฿\\n.ᐟ ⁎̶ ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈	ORDER-1759750606025-1bjRzHm7	success	2025-10-06 11:36:46.977
cmgf3a2pz0000jh04gli0njx4	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv	15	CANVA 30 วัน ( เมลร้าน )	40	\\nemail : rolmayjil@gmail.com       \\npass : HUI12345.                                                                                   \\nexp : 04/11/2025 \\n\\n˙ ◟ อ่านกฎก่อนเข้าใช้งาน ˒ ˶                                             \\n ❌ห้ามนำเมลไปทำแอพอื่นโดยเด็ดขาด❌                        \\n♡ ห้ามกดออกจากครอบครัว เปลี่ยนรหัส เปลี่ยนรูป เปลี่ยนชื่อเองเด็ดขาด                                                               \\n♡ เข้าแอพแล้วห้ามออกจากระบบจนกว่าจะหมดอายุนะคะ                                                                                     \\n♡ หากพบเจอคนทำผิดกฎ ขออนุญาตปรับ 500฿ และ ลบออกจากแฟมทันที(เปลี่ยนรหัส)                                              \\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1759752627406-1bjRzHm7	success	2025-10-06 12:10:29.063
cmgg2n0o50000i504x1q70t69	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv	65	TrueID+ 30 วัน ÷4	35	\\n❣️Email : 0817172313 \\nPassword : Ar84351069 \\nจอ/ที่ : 3 \\nวันหมดอายุ : 05/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1759812017762-1bjRzHm7	success	2025-10-07 04:40:19.493
cmgg2pi9j0001i504lr80yphn	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv	106	CAPCUT PRO 7 วัน ÷4	45	\\n❣️Email : nona981365@auraity.com \\nPassword : 77sapcut \\nวันหมดอายุ : 13/10/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ แอคหาร \\n❌ ไม่ต้องอัพโหลด \\n⚠️จะไม่เห็นงานกัน\\nถ้ากดอัพโหลดคนที่หารด้วยจะเห็นงานเรา \\nയ﹆ ซื้อ 1 ที่ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถใช้ต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1759812134174-1bjRzHm7	success	2025-10-07 04:42:15.607
cmgyy1xqt0001iyblxxnbf9hw	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	16	YouTube 30 DAYS  (ไม่ต่อ เมลลูกค้า)	15	\\n⚱วิธีตอบรับคำเชิญ YOUTUBE ✂   \\n1. กดลิงค์ :https://families.google.com/join/promo/dpGZwY0pgzlJlQWUJWg_syy1xf376w?utm_medium=email\\n\\nเข้า 1 อุปกรณ์เท่านั้น\\nหากโดนยกเลิกการเข้ายูทูปไม่มีเคลมทุกกรณี\\n\\n2. กดเริ่มต้นการใช้งาน ☠ \\n  -  ล็อกอินเมลที่สมัคร \\n  - กดเข้าร่วมครวบครัวได้เลยค้าบ\\n\\n❔วิธีออกกลุ่มครอบครัวเก่า you tube ♠\\n\\n‼️เฉพาะติดครอบครัวเก่าเท่านั้น‼️\\nหากมีการกดออกเอง ซื้อใหม่ค่า\\n\\nhttps://families.google.com/families\\n1.จิ้มลิงก์ด้านบนได้เลย⚖\\n2.เลือกเมนู ≡  [ ด้านบนซ้ายมือเลยงับ ]♟\\n3.กด ออกจากกลุ่มครอบครัว☦\\n4.กรอกรหัสผ่านเมล ยืนยันการออกแฟมเก่า⏱\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1760953174061-8b1QbvyX	success	2025-10-20 09:39:34.805
cmh27osfk0000la047ftk3j5e	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	70	MAIL GOOGLE (ขึ้นเเพ็ค YouTube)	25	\\nmail : raxvionna@gmail.com                                                                                                                                         \\npass : hrahus123\\n\\nหากติดยืนยัน กดยืนยันเมลสำรองเเละใส่เมลสำรองที่ร้านให้\\n\\n✅ลูกค้ารบกวนอ่านสักนิดนะคะ‼️\\nรับเคลม10ชั่วโมง เข้าเมลไม่ได้ให้แจ้งทันที เข้าแล้วรบกวนเปลี่ยนรหัสถ้าไม่เปลี่ยนอาจจะโดนดึงหรือกรณีอื่นๆหลังจากนี้ทางร้านจะไม่รับเคลมใดๆทิ้งสิ้น\\n\\n(ร้านแจ้งชัดเจนแล้วนะคะไม่อยากให้เกิดปัญหาภายหลัง ขอบคุณค่ะ)⛸	ORDER-1761150754263-8b1QbvyX	success	2025-10-22 16:32:36.08
cmh28f0090000l804tttx97o5	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	32	VIU 30 วัน (จอหาร) ÷5	25	\\n❣️Email : v.iuvip.p.u.n.g.5.9.56.ma.y@gmail.com \\nPassword : Gw38147639 \\nจอ/ที่ : 2 \\nวันหมดอายุ : 22/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761151977182-8b1QbvyX	success	2025-10-22 16:52:58.954
cmh28swj20001l1059m9orm9j	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	32	VIU 30 วัน (จอหาร) ÷5	25	\\n❣️Email : v.iuvip.p.u.n.g.5.9.56.ma.y@gmail.com \\nPassword : Gw38147639 \\nจอ/ที่ : 3 \\nวันหมดอายุ : 22/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761152625815-8b1QbvyX	success	2025-10-22 17:03:47.631
cmh292pp80001iyw98sahjasm	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	70	MAIL GOOGLE (ขึ้นเเพ็ค YouTube)	25	\\nmail : flotneria@gmail.com                                                                                                                                        \\npass : ffl0tn3rI__\\n\\nหากติดยืนยัน กดยืนยันเมลสำรองเเละใส่เมลสำรองที่ร้านให้\\n\\n✅ลูกค้ารบกวนอ่านสักนิดนะคะ‼️\\nรับเคลม10ชั่วโมง เข้าเมลไม่ได้ให้แจ้งทันที เข้าแล้วรบกวนเปลี่ยนรหัสถ้าไม่เปลี่ยนอาจจะโดนดึงหรือกรณีอื่นๆหลังจากนี้ทางร้านจะไม่รับเคลมใดๆทิ้งสิ้น\\n\\n(ร้านแจ้งชัดเจนแล้วนะคะไม่อยากให้เกิดปัญหาภายหลัง ขอบคุณค่ะ)⛸	ORDER-1761153084206-8b1QbvyX	success	2025-10-22 17:11:25.341
cmh297ulb0000iy4t86hgm4e4	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	35	PrimeVideo 7 วัน (ส่วนตัว) ÷4	29	\\nอ่าน❗️ห้ามเข้าหลายอุปกรณ์เด็ดขาด 1จอ/1อุปกรณ์\\nห้ามพยายามเข้าเด็ดขาด หากเข้าไม่ได้ต้องทักหาแอดมินเท่านั้น \\n\\nUsername : san.u4@outlook.com \\nPass : prime111 \\nจอ : 4 \\nหมดอายุ : 29/10/2568\\n\\nวิธีล็อคจอ ของลูกค้าเอง\\n1.แก้ไขโปรไฟล์ เลือกจอของลูกค้า\\n2.รหัส PIN ล็อคจอ กดจัดการ\\n3.ตั้งรหัส 5 ตัวแล้วกดทำต่อ เสร็จสิ้นคับ\\n❌ห้ามรับชมเกิน 1 เครื่อง ❌\\n\\nหากเป็นหนัง 21+ จะติดพินแอดมินตั้งพิน :12345 (ห้ามเปลี่ยนพินเด็ดขาด)\\n\\nคำเตือน : ⬪:☘˵ กฎการใช้งาน ٠✅ *⑅\\nയ﹆ *ล็อคอินทันทีที่ได้รหัส ❗️\\nയ﹆  *ติดยืนยันแจ้งอุปกรณ์ที่เข้ากับจังหวัดทันทีเพื่อรับรหัสotpยืนยันการเข้าใช้งาน ❗️ไม่รับเคลมในกรณีโดนปิด/โดนล็อค (การโดนปิดหรือโดนล็อคเป็นการใช้หลายอุปกรณ์ เข้าถี่ๆ ไม่เคยมทุกกรณ๊งดวีน) \\n.ᐟ ⁎̶ ⛑ *รหัสล้อคไห้รอสักพักค่อยเข้าใหม่อีกครั้ง ⸝⸝⸝ ⛔️ ✱ ◡̈ \\n\\n⚱*จอเต็มแนะนำไห้ดาวโหลดดูก่อนนะคะ\\n\\nหากติดยืนยัน OTP กดลิงค์ : https://otpamazon2468.csmailgod.com\\nห้ามพยายามเข้า หากกด1ครั้งเเล้วไม่ได้ต้องแจ้งแอดมินทันที\\nกดถี่จะทำให้แอคล็อคไม่มีเคลมทุกกรณี\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761153323752-8b1QbvyX	success	2025-10-22 17:15:24.959
cmh29fe810000l804zdjwc9o7	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	32	VIU 30 วัน (จอหาร) ÷5	25	\\n❣️Email : v.iuvip.p.u.n.g.5.9.56.ma.y@gmail.com \\nPassword : Gw38147639 \\nจอ/ที่ : 4 \\nวันหมดอายุ : 22/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761153675074-8b1QbvyX	success	2025-10-22 17:21:16.994
cmh29k5t60000jl04my720uub	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	23	Wetv 30 วัน (จอหาร) ÷4	45	\\n❣️Email : 0979344976 \\nPassword : Ck86409823 \\nจอ/ที่ : 3 \\nวันหมดอายุ : 22/11/2568\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761153897467-8b1QbvyX	success	2025-10-22 17:24:59.371
cmh29su0m0000js04ukxwjb4k	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	65	TrueID+ 30 วัน ÷4	35	\\n❣️Email : 0944712770 \\nPassword : Cg84351069 \\nจอ/ที่ : 1 \\nวันหมดอายุ : 21/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761154302091-8b1QbvyX	success	2025-10-22 17:31:43.99
cmh4npd2r0000l5042a7poq3b	DkC6JUXnfpmTddUNpPsgp1fPALT5GaWW	65	TrueID+ 30 วัน ÷4	35	\\n❣️Email : 0944712770 \\nPassword : Cg84351069 \\nจอ/ที่ : 4 \\nวันหมดอายุ : 22/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761298587317-DkC6JUXn	success	2025-10-24 09:36:29.044
cmh92zs410000la04dv5bdgcv	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	23	Wetv 30 วัน (จอหาร) ÷4	45	\\n❣️Email : khimatasakh.ikachi@gmail.com \\nPassword : wetv30days \\nจอ/ที่ :  1\\nวันหมดอายุ : 27/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761566130485-OdLhumV8	success	2025-10-27 11:55:34.034
cmh934gi50000l204g2ak7lqc	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	67	CH 3 Plus 30 วัน ÷2	55	\\n❣️Email : 0616376022                                                                   \\nPassword : Md6758964                                                                            \\nจอ/ที่ : 2                                                                       \\nวันหมดอายุ : 25/11/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1761566348760-OdLhumV8	success	2025-10-27 11:59:12.27
cmhagu2uy0000jo04heh6zul6	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	1	✨แอคนอกมีเคลม NF ตัด00.00 (ทุกอุปกรณ์) 	10	\\n⏲email : aroyse0002.us@amexman.in \\n☘pass : mmmooo \\n⚱profile : 5 ( เข้า 1 อุปกรณ์ห้ามมั่ว/สลับ ) \\n⚜pin : สามารถตั้งเองได้เลย \\n⌛️exp : 28/10/2025\\n\\n✷เงื่อนไขแบบแอคนอก✷\\nแอคนอก?\\n\\nปัญหาที่จะพบ\\n\\nบัคที่อุปกรณ์ วิธีเเก้(รีเน็ตใหม่,ปิดและเปิดเครื่องใหม่,เปลี่ยนอุปกร์ใหม่)\\n1. มีความเสี่ยงโดนปิดเหมือนแอคไทย\\n2. ระบบรีรหัส ต้องรอแก้ภายใน 24 ชม. ห้ามเหวี่ยงห้ามวีน\\n3. ร้านประกันปิด 1 ครั้ง\\n\\nรายละเอียดการประกัน\\n☃☃-รายวันเคลมตลอดการใช้งาน\\n♔♔-7 วัน ระยะประกันเคลม (5 วัน)\\n❤❤-30 วัน ระยะประกันเคลม (15 วัน)\\n❀❀-รอเคลม 24-48 ชม. ไม่ทบวัน ถ้าเกิน 48 ชม. ทบ 1 วัน หลังกดซื้อ\\n\\nคำเตือน : ⬪:˵ กฎการใช้งาน ٠ *⑅\\nയ﹆ เข้าได้ เปลี่ยนชื่อจอทันที / ห้ามมั่วจอ ⚠️\\nയ﹆ Netflix ตัดเวลา 22.00 น. ของวันหมดอายุ\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น เข้าเกินปรับ 1,000฿\\n.ᐟ ⁎̶ ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈	ORDER-1761649846967-8b1QbvyX	success	2025-10-28 11:10:48.826
cmhi1y0li0002ju042iqvus3x	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	17	YouTube 30 DAYS (ไม่ต่อ เมลร้าน) 	40	\\nemail : tndv6@chb.needs.or.id \\npass : linkinpark123 \\nexp : 01/12/2568 \\n\\nหากติดยืนยัน กดยืนยันเมลสำรองเเละใส่เมลสำรองที่ร้านให้\\n\\n˙ ◟ อ่านกฎก่อนเข้าใช้งาน ˒ ˶                                             \\nเข้า 1 อุปกรณ์เท่านั้น \\nหากโดนยกเลิกการเข้ายูทูปไม่มีเคลมทุกกรณี \\n ❌ห้ามนำเมลไปทำแอพอื่นโดยเด็ดขาด❌                        \\n♡ ห้ามกดออกจากครอบครัว เปลี่ยนรหัส เปลี่ยนรูป เปลี่ยนชื่อเองเด็ดขาด                                                               \\n♡ เข้าแอพแล้วห้ามออกจากระบบจนกว่าจะหมดอายุนะคะ                                                                                     \\n♡ หากพบเจอคนทำผิดกฎ ขออนุญาตปรับ 500฿ และ ลบออกจากแฟมทันที(เปลี่ยนรหัส)                                              \\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1762108565941-OdLhumV8	success	2025-11-02 18:36:07.686
cmhxgq6cs0000jp042p4gi0ek	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	67	CH 3 Plus 30 วัน ÷2	55	\\n❣️Email : 0650023001 \\nPassword : Wv6758964 \\nจอ/ที่ : 1 \\nวันหมดอายุ : 13/12/2025\\n\\nคำเตือน : ⬪:˵✴️ กฎการใช้งาน❗️٠ *⑅ \\nയ﹆ เป็นเมล-พาสร้าน ห้ามเปลี่ยนรหัสหรือยุ่งกับอย่างอื่น⚠️ \\nയ﹆ จอหาร หากจอชนรอเท่านั้น\\nയ﹆ ซื้อ 1 จอ เข้า 1 เครื่องเท่านั้น ห้ามสลับเครื่องไปมา \\n\\n.ᐟ  ⁎̶  ห้ามเผยแพร่รหัส พบเจอ ยึดจอทันที ⸝⸝⸝ ⛔️ ✱ ◡̈\\n\\nอ่านเเละทำความเข้าใจการหารแอพ✨\\n▪▪▪▪▪▪▪▪▪▪\\nด้วยระบบแอพมีการอัพเดทกฎ ‼️\\n➡หากมีการปรับเปลี่ยนทางระบบของแอพ จะต้องปรับเปลี่ยนไปตามอัพเดทนะคะ \\n\\n‼ด้วยเหตุผลการมาหารจอ‼\\n➡ซึ่งทางร้านตอนสมัครก็สมัครตามแอพเเต่หากตอนนี้มีการอัพเดทจะทำให้แอคเก่าๆก็มีผลเช่นเดียวกัน \\n\\n❌ ไม่เคลมกรณีระบบทางแอพ เเต่ละแอพมีการอัพเดท/ยกเลิก/ปัญหาจากระบบทางแอพเองทั้งหมดกระทันหันเเละไม่สามารถรับชมต่อได้\\n✔ แต่หากเป็นความผิดของร้าน ร้านพร้อมที่จะรับผิดชอบและเเก้ปัญหาให้ทุกกรณี??\\n▪▪▪▪▪▪▪▪▪▪	ORDER-1763040387073-OdLhumV8	success	2025-11-13 13:26:28.78
\.


--
-- Data for Name: redeem_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.redeem_history (id, "payloadHash", amount, "userId", "redeemedAt") FROM stdin;
cmi651sm00001v2x8ccfofpaa	019a9ca9d2e17949a44bb255949b1fbb06k	9.71	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	2025-11-19 15:09:31.029
cmibo0was0001la040usbx0jl	019ab094e86c7bbba07304a4230a3d0b855	19.42	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-11-23 11:59:32.739
\.


--
-- Data for Name: server; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.server (id, name, "serverCode", "isActive", "createdAt", "updatedAt", "gameId") FROM stdin;
e8a2d9ff-550d-4687-8ea8-979316b4a2a7	Asia	AS	t	2025-11-19 12:51:15.253	2025-11-19 12:51:15.253	2fd884b4-33e3-412b-bc25-4deb754ca5d7
444cfbf7-b80a-4f6e-bdaf-b00e00484185	America	US	t	2025-11-19 12:51:15.385	2025-11-19 12:51:15.385	2fd884b4-33e3-412b-bc25-4deb754ca5d7
1c49a90a-4888-484b-94ce-a01984585759	Europe	EU	t	2025-11-19 12:51:15.472	2025-11-19 12:51:15.472	2fd884b4-33e3-412b-bc25-4deb754ca5d7
4b26c620-7307-4cc5-a6cc-fe8650fa4135	Taiwan, Hongkong, Macau	CN	t	2025-11-19 12:51:15.559	2025-11-19 12:51:15.559	2fd884b4-33e3-412b-bc25-4deb754ca5d7
c0c6a155-ee58-4c23-91dd-641e3686957e	Asia	AS	t	2025-11-19 12:51:16.57	2025-11-19 12:51:16.57	a11e672b-a912-4b14-acbf-e6cb9794fa8e
e8fa3112-24bd-4b07-b14b-13f2a6fbd15c	America	US	t	2025-11-19 12:51:16.657	2025-11-19 12:51:16.657	a11e672b-a912-4b14-acbf-e6cb9794fa8e
82549118-0f25-4293-bfab-e86b46f8819d	Europe	EU	t	2025-11-19 12:51:16.745	2025-11-19 12:51:16.745	a11e672b-a912-4b14-acbf-e6cb9794fa8e
04265624-38d9-4560-b678-6ccf4cdb03c4	Taiwan, Hongkong, Macau	CN	t	2025-11-19 12:51:16.833	2025-11-19 12:51:16.833	a11e672b-a912-4b14-acbf-e6cb9794fa8e
e22127cb-93cc-46ee-86ce-7f494b0ed10f	Asia	AS	t	2025-11-19 12:51:17.753	2025-11-19 12:51:17.753	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
45ebbaa7-0a03-4c18-b712-3a4510d07216	America	US	t	2025-11-19 12:51:17.841	2025-11-19 12:51:17.841	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
192b072e-77e5-4ae6-8915-57a7e28fb433	Europe	EU	t	2025-11-19 12:51:17.929	2025-11-19 12:51:17.929	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
8d206909-913a-4d5b-b760-0c2d8b5adef5	Taiwan, Hongkong, Macau	CN	t	2025-11-19 12:51:18.016	2025-11-19 12:51:18.016	18fad89d-df1d-4cae-a723-c5c4a3fe3d2e
d340d831-515b-42b8-a46a-b4b4b52fcee7	Ailinie	8008	t	2025-11-19 12:51:20.267	2025-11-19 12:51:20.267	7dbb577d-1103-4840-9d57-d9751760be9f
2c1e1784-f841-4d5e-8c90-b8f7492ee407	Amaze Island	8035	t	2025-11-19 12:51:20.354	2025-11-19 12:51:20.354	7dbb577d-1103-4840-9d57-d9751760be9f
87893f1e-66aa-43f0-bb5c-a458f7e949d1	Aqua Road	8005	t	2025-11-19 12:51:20.441	2025-11-19 12:51:20.441	7dbb577d-1103-4840-9d57-d9751760be9f
d8c325c9-52ca-4a74-b62d-221c20a06487	Arcana	8118	t	2025-11-19 12:51:20.529	2025-11-19 12:51:20.529	7dbb577d-1103-4840-9d57-d9751760be9f
dc69f486-738f-445c-bc72-f3e0e9eb3ca4	Ariant	8102	t	2025-11-19 12:51:20.619	2025-11-19 12:51:20.619	7dbb577d-1103-4840-9d57-d9751760be9f
1f926460-cb64-4521-8804-f431557e026c	Ariante	8103	t	2025-11-19 12:51:20.706	2025-11-19 12:51:20.706	7dbb577d-1103-4840-9d57-d9751760be9f
724c8d7f-9dc9-4059-a213-e7d44de000f0	Asulon	8029	t	2025-11-19 12:51:20.794	2025-11-19 12:51:20.794	7dbb577d-1103-4840-9d57-d9751760be9f
4b3f7fee-4785-4a7c-9a18-8ca7a6dac3ef	Aswan	8018	t	2025-11-19 12:51:20.882	2025-11-19 12:51:20.882	7dbb577d-1103-4840-9d57-d9751760be9f
a24020f6-b8e8-4b8d-bde1-52ea7f9bb715	Axe Stump	8063	t	2025-11-19 12:51:20.969	2025-11-19 12:51:20.969	7dbb577d-1103-4840-9d57-d9751760be9f
6c82ed54-a32b-49ef-ae18-c986ef22fcc0	Baby Mushroom	8044	t	2025-11-19 12:51:21.057	2025-11-19 12:51:21.057	7dbb577d-1103-4840-9d57-d9751760be9f
923d948f-cca8-407e-8551-e51f494398c8	Barbarian End	8115	t	2025-11-19 12:51:21.143	2025-11-19 12:51:21.143	7dbb577d-1103-4840-9d57-d9751760be9f
e73fc3c7-228b-4f39-a288-602ebebb6a0a	Belda	8030	t	2025-11-19 12:51:21.23	2025-11-19 12:51:21.23	7dbb577d-1103-4840-9d57-d9751760be9f
53404efc-0d28-43ec-b507-680d5540634f	Bellamoa	8168	t	2025-11-19 12:51:21.318	2025-11-19 12:51:21.318	7dbb577d-1103-4840-9d57-d9751760be9f
d5cbcdaa-3c42-473c-97c9-dca5f7f8d658	Beritas	8100	t	2025-11-19 12:51:21.405	2025-11-19 12:51:21.405	7dbb577d-1103-4840-9d57-d9751760be9f
41aac6ef-96aa-4e68-b743-29833db02c4d	Big Whale	8086	t	2025-11-19 12:51:21.493	2025-11-19 12:51:21.493	7dbb577d-1103-4840-9d57-d9751760be9f
c3150099-3d9d-4538-8af9-d65cbb01e0ac	Black Dragon	8079	t	2025-11-19 12:51:21.58	2025-11-19 12:51:21.58	7dbb577d-1103-4840-9d57-d9751760be9f
8e828330-951a-4052-9fe9-2741900eaca8	Black Kentaurus	8195	t	2025-11-19 12:51:21.667	2025-11-19 12:51:21.667	7dbb577d-1103-4840-9d57-d9751760be9f
0ec80614-451b-46e4-8801-6186d15cbad5	Black Spirit Mage	8191	t	2025-11-19 12:51:21.754	2025-11-19 12:51:21.754	7dbb577d-1103-4840-9d57-d9751760be9f
13a84c05-f927-4d2b-8518-2476bba85e95	Blue Bubble Fish	8172	t	2025-11-19 12:51:21.841	2025-11-19 12:51:21.841	7dbb577d-1103-4840-9d57-d9751760be9f
1c853b67-7c9d-4da7-aafb-a2b92668c958	Blue Dragon	8078	t	2025-11-19 12:51:21.928	2025-11-19 12:51:21.928	7dbb577d-1103-4840-9d57-d9751760be9f
42eed2ca-fbd2-48d0-8302-9db4e0165260	Blue Kentaurus	8194	t	2025-11-19 12:51:22.016	2025-11-19 12:51:22.016	7dbb577d-1103-4840-9d57-d9751760be9f
6b9542fc-9b53-44b8-b485-195467050089	Blue Mushroom	8050	t	2025-11-19 12:51:22.104	2025-11-19 12:51:22.104	7dbb577d-1103-4840-9d57-d9751760be9f
53e01f38-d61d-4077-89e8-19d9c25387b6	Blue Snail	8042	t	2025-11-19 12:51:22.192	2025-11-19 12:51:22.192	7dbb577d-1103-4840-9d57-d9751760be9f
34a0deb8-a4ea-49d8-8ebc-36114a870b05	Blue Spirit Mage	8190	t	2025-11-19 12:51:22.279	2025-11-19 12:51:22.279	7dbb577d-1103-4840-9d57-d9751760be9f
6735baed-7897-4b52-b822-bd9aa469ec5d	Blue Tube Slime	8181	t	2025-11-19 12:51:22.366	2025-11-19 12:51:22.366	7dbb577d-1103-4840-9d57-d9751760be9f
7add04b3-c2ab-4e9c-8dea-2a2ebfc34f93	Bombing Fish House	8170	t	2025-11-19 12:51:22.453	2025-11-19 12:51:22.453	7dbb577d-1103-4840-9d57-d9751760be9f
cd4b44b1-9916-4c43-8f14-9edd062c3f94	Bone Fish	8076	t	2025-11-19 12:51:22.54	2025-11-19 12:51:22.54	7dbb577d-1103-4840-9d57-d9751760be9f
08d3776b-4c97-4474-abe4-c03c74b934d7	Brown Teddy	8155	t	2025-11-19 12:51:22.627	2025-11-19 12:51:22.627	7dbb577d-1103-4840-9d57-d9751760be9f
80af84bc-4b8e-471e-b1c0-ab2dec92369b	Bubble Fish	8073	t	2025-11-19 12:51:22.714	2025-11-19 12:51:22.714	7dbb577d-1103-4840-9d57-d9751760be9f
793c9cc3-7d53-47c6-94ae-573c7844be5f	Bubbling	8046	t	2025-11-19 12:51:22.801	2025-11-19 12:51:22.801	7dbb577d-1103-4840-9d57-d9751760be9f
3d55d7ae-1588-4e65-9f19-88467cf1976d	Captain Darkgoo	8175	t	2025-11-19 12:51:22.889	2025-11-19 12:51:22.889	7dbb577d-1103-4840-9d57-d9751760be9f
b0a7daea-fe50-496b-adc5-0f14d00b7154	Carruthers	8094	t	2025-11-19 12:51:22.976	2025-11-19 12:51:22.976	7dbb577d-1103-4840-9d57-d9751760be9f
5d8f0a8b-afd7-4aef-a7cd-0bc8e581b835	Cave of Life	8095	t	2025-11-19 12:51:23.064	2025-11-19 12:51:23.064	7dbb577d-1103-4840-9d57-d9751760be9f
fecacbd6-5e3a-4138-9b96-d6e747342235	Cellion	8128	t	2025-11-19 12:51:23.152	2025-11-19 12:51:23.152	7dbb577d-1103-4840-9d57-d9751760be9f
02b7dc4f-9fbf-4bf4-97ef-d787300c02de	Chaos Creature	8187	t	2025-11-19 12:51:23.239	2025-11-19 12:51:23.239	7dbb577d-1103-4840-9d57-d9751760be9f
e1cf5ea2-80c3-4890-aca8-2ffcbc0c7aff	Chirp Island	8036	t	2025-11-19 12:51:23.326	2025-11-19 12:51:23.326	7dbb577d-1103-4840-9d57-d9751760be9f
394fe15c-6e8a-443f-b130-0374aa8158a0	Cico	8071	t	2025-11-19 12:51:23.414	2025-11-19 12:51:23.414	7dbb577d-1103-4840-9d57-d9751760be9f
e2ad8221-67e2-4463-89d9-e90d761ceaaf	Cloud Valley	8031	t	2025-11-19 12:51:23.501	2025-11-19 12:51:23.501	7dbb577d-1103-4840-9d57-d9751760be9f
1f4fec21-d70b-4c75-9ea4-82a360271e7d	Coconut Slime	8176	t	2025-11-19 12:51:23.588	2025-11-19 12:51:23.588	7dbb577d-1103-4840-9d57-d9751760be9f
50be5b78-c5cb-4e35-902a-07ce26a9d68a	Cold Eye	8133	t	2025-11-19 12:51:23.675	2025-11-19 12:51:23.675	7dbb577d-1103-4840-9d57-d9751760be9f
38f8954d-557c-45f2-a11b-503880cc3042	Crimson Balrog	8057	t	2025-11-19 12:51:23.762	2025-11-19 12:51:23.762	7dbb577d-1103-4840-9d57-d9751760be9f
c3b441bc-9682-4aad-8672-47970d6f3932	Curse Eye	8132	t	2025-11-19 12:51:23.849	2025-11-19 12:51:23.849	7dbb577d-1103-4840-9d57-d9751760be9f
e09c7e1b-a392-4b90-8d3a-7542e2df3db8	Dark Cornian	8197	t	2025-11-19 12:51:23.937	2025-11-19 12:51:23.937	7dbb577d-1103-4840-9d57-d9751760be9f
d5059862-49e5-4f8e-821d-83b981af6464	Dark Stone Golem	8199	t	2025-11-19 12:51:24.026	2025-11-19 12:51:24.026	7dbb577d-1103-4840-9d57-d9751760be9f
2f844ee0-4e82-4da4-a251-d3fe6f619a93	Death Teddy	8174	t	2025-11-19 12:51:24.113	2025-11-19 12:51:24.113	7dbb577d-1103-4840-9d57-d9751760be9f
20120b6b-6343-4480-8c07-13822360013a	Defense Headquarters	8089	t	2025-11-19 12:51:24.2	2025-11-19 12:51:24.2	7dbb577d-1103-4840-9d57-d9751760be9f
141b93cf-a650-463c-8a37-d48cf06a74b0	Desert Giant	8142	t	2025-11-19 12:51:24.29	2025-11-19 12:51:24.29	7dbb577d-1103-4840-9d57-d9751760be9f
ddee0055-7902-42f2-ad36-8d26efc5733b	Destroyer Creature	8186	t	2025-11-19 12:51:24.377	2025-11-19 12:51:24.377	7dbb577d-1103-4840-9d57-d9751760be9f
f8fdd01b-d4d1-4005-ac2c-acad67dfd457	Dream City	8038	t	2025-11-19 12:51:24.464	2025-11-19 12:51:24.464	7dbb577d-1103-4840-9d57-d9751760be9f
7eb02689-94ff-494e-8e30-fb01b05cc665	Drumming Bunny	8154	t	2025-11-19 12:51:24.551	2025-11-19 12:51:24.551	7dbb577d-1103-4840-9d57-d9751760be9f
8213fba1-d22c-43d1-bb02-f3130c446dd0	Dual Ghost Pirate	8158	t	2025-11-19 12:51:24.638	2025-11-19 12:51:24.638	7dbb577d-1103-4840-9d57-d9751760be9f
7030e25d-5f9c-4315-9ece-e776b3567475	Dyle	8163	t	2025-11-19 12:51:24.734	2025-11-19 12:51:24.734	7dbb577d-1103-4840-9d57-d9751760be9f
cfeeb072-3312-477a-8006-0c737d1764a8	Ear Plug Plead	8143	t	2025-11-19 12:51:24.821	2025-11-19 12:51:24.821	7dbb577d-1103-4840-9d57-d9751760be9f
1f3b1a24-b01b-4e59-8ea8-dc8f59965d84	El Nath	8096	t	2025-11-19 12:51:24.908	2025-11-19 12:51:24.908	7dbb577d-1103-4840-9d57-d9751760be9f
c7b67778-d98c-41d0-9b15-438c4a5bac3c	Elderstein	8021	t	2025-11-19 12:51:24.996	2025-11-19 12:51:24.996	7dbb577d-1103-4840-9d57-d9751760be9f
845261c2-91d6-4caf-8064-0eaa650e0271	Eliza	8056	t	2025-11-19 12:51:25.084	2025-11-19 12:51:25.084	7dbb577d-1103-4840-9d57-d9751760be9f
0fe712e1-9c68-4aba-b686-f908a9c04c12	Ellinia	8083	t	2025-11-19 12:51:25.173	2025-11-19 12:51:25.173	7dbb577d-1103-4840-9d57-d9751760be9f
ff46c3ca-f0ba-432e-b0d7-c3c53579887d	Emerald Clam Slime	8178	t	2025-11-19 12:51:25.261	2025-11-19 12:51:25.261	7dbb577d-1103-4840-9d57-d9751760be9f
4b84ad38-2370-4f31-9b5e-55faa83ab3e8	Ephenia	8122	t	2025-11-19 12:51:25.351	2025-11-19 12:51:25.351	7dbb577d-1103-4840-9d57-d9751760be9f
480d8c2f-b4ee-432c-b462-c80a367ee3cc	Erodin	8024	t	2025-11-19 12:51:25.438	2025-11-19 12:51:25.438	7dbb577d-1103-4840-9d57-d9751760be9f
10eca7c5-4013-4923-810f-67f09f895899	Espera	8120	t	2025-11-19 12:51:25.525	2025-11-19 12:51:25.525	7dbb577d-1103-4840-9d57-d9751760be9f
82aaa5d5-9a35-414f-a6db-2aca3f25a38e	Evil Eye	8131	t	2025-11-19 12:51:25.612	2025-11-19 12:51:25.612	7dbb577d-1103-4840-9d57-d9751760be9f
40276467-d573-46a2-942f-f6eca00e2fca	Fairy	8047	t	2025-11-19 12:51:25.7	2025-11-19 12:51:25.7	7dbb577d-1103-4840-9d57-d9751760be9f
8751f9a8-83fa-4cf8-90d5-46f8fba12410	Fairy Academy	8084	t	2025-11-19 12:51:25.787	2025-11-19 12:51:25.787	7dbb577d-1103-4840-9d57-d9751760be9f
b354a29e-ad0c-4ad7-a57d-d6601c9468cb	Fantasy Village	8088	t	2025-11-19 12:51:25.874	2025-11-19 12:51:25.874	7dbb577d-1103-4840-9d57-d9751760be9f
1f1ddb48-e1b0-4431-b83d-a36d38361a72	Fear Gazer	8188	t	2025-11-19 12:51:25.963	2025-11-19 12:51:25.963	7dbb577d-1103-4840-9d57-d9751760be9f
9ad09ec2-6c30-42f0-9970-2f2c72dd0581	Fear Raider	8189	t	2025-11-19 12:51:26.051	2025-11-19 12:51:26.051	7dbb577d-1103-4840-9d57-d9751760be9f
530231f9-e2c6-4323-8a9a-dfb91d1fa5de	Fire Boar	8054	t	2025-11-19 12:51:26.139	2025-11-19 12:51:26.139	7dbb577d-1103-4840-9d57-d9751760be9f
cfa2ee50-ea9b-4a59-90ed-9a5ab6962ec5	Flower Fish	8167	t	2025-11-19 12:51:26.226	2025-11-19 12:51:26.226	7dbb577d-1103-4840-9d57-d9751760be9f
70110ffe-9525-4766-9a7b-f17285828f04	Flying Fish Slime	8138	t	2025-11-19 12:51:26.313	2025-11-19 12:51:26.313	7dbb577d-1103-4840-9d57-d9751760be9f
2ffcce74-32d0-468f-8880-1f9d333c549a	Fox Valley	8027	t	2025-11-19 12:51:26.402	2025-11-19 12:51:26.402	7dbb577d-1103-4840-9d57-d9751760be9f
25705e1d-ac46-460f-a5f0-9447ea31bdb1	Gate to the Future	8110	t	2025-11-19 12:51:26.494	2025-11-19 12:51:26.494	7dbb577d-1103-4840-9d57-d9751760be9f
17770419-3e15-46cf-ba14-13a720fe6bc0	Gate to the Past	8108	t	2025-11-19 12:51:26.581	2025-11-19 12:51:26.581	7dbb577d-1103-4840-9d57-d9751760be9f
0a33c739-c357-4ebb-ae39-9b6addcbe824	Gate to the Present	8109	t	2025-11-19 12:51:26.669	2025-11-19 12:51:26.669	7dbb577d-1103-4840-9d57-d9751760be9f
04bd40d4-2423-4777-8cf5-79ee18dfb621	Ghost Pirate	8159	t	2025-11-19 12:51:26.756	2025-11-19 12:51:26.756	7dbb577d-1103-4840-9d57-d9751760be9f
b2e0668b-b2f9-4e40-bf11-7a3763128c88	Ghost Stump	8064	t	2025-11-19 12:51:26.843	2025-11-19 12:51:26.843	7dbb577d-1103-4840-9d57-d9751760be9f
53253cdc-bdfe-4a9f-bb9d-f2414adeb56f	Gigantic Spirit Viking	8157	t	2025-11-19 12:51:26.93	2025-11-19 12:51:26.93	7dbb577d-1103-4840-9d57-d9751760be9f
ab239184-31cc-479e-a528-23693eae9852	Goby	8074	t	2025-11-19 12:51:27.018	2025-11-19 12:51:27.018	7dbb577d-1103-4840-9d57-d9751760be9f
3d1c72ff-d3b0-4aa7-af71-a79a5f52fb46	Gold Beach	8087	t	2025-11-19 12:51:27.105	2025-11-19 12:51:27.105	7dbb577d-1103-4840-9d57-d9751760be9f
840a7a1c-684f-4e76-b006-465bc1f8b515	Golden Coast	8009	t	2025-11-19 12:51:27.193	2025-11-19 12:51:27.193	7dbb577d-1103-4840-9d57-d9751760be9f
7aaeba14-f5a4-429a-bb57-2512fc53ce67	Golden Temple	8106	t	2025-11-19 12:51:27.28	2025-11-19 12:51:27.28	7dbb577d-1103-4840-9d57-d9751760be9f
1b517988-2bd4-4047-a983-47214dbae770	Green Cornian	8196	t	2025-11-19 12:51:27.368	2025-11-19 12:51:27.368	7dbb577d-1103-4840-9d57-d9751760be9f
479db6a6-15cc-47cf-9abc-51b35c363564	Green Mushroom	8048	t	2025-11-19 12:51:27.455	2025-11-19 12:51:27.455	7dbb577d-1103-4840-9d57-d9751760be9f
c45f9581-435c-4848-adb3-c04a691e6df9	Grove	8003	t	2025-11-19 12:51:27.542	2025-11-19 12:51:27.542	7dbb577d-1103-4840-9d57-d9751760be9f
05e78407-cd73-4443-9614-5317de3eae7a	Grupin	8130	t	2025-11-19 12:51:27.63	2025-11-19 12:51:27.63	7dbb577d-1103-4840-9d57-d9751760be9f
af2a298a-3d4b-455b-affa-1b4d5fb520e1	Gryffindor	8135	t	2025-11-19 12:51:27.717	2025-11-19 12:51:27.717	7dbb577d-1103-4840-9d57-d9751760be9f
e17f798b-30d7-48dd-8ba7-cc7a50156f12	Guard Robot	8161	t	2025-11-19 12:51:27.805	2025-11-19 12:51:27.805	7dbb577d-1103-4840-9d57-d9751760be9f
1960b1f6-9b0b-49e6-a434-8067217ecbf7	Helisimus	8112	t	2025-11-19 12:51:27.893	2025-11-19 12:51:27.893	7dbb577d-1103-4840-9d57-d9751760be9f
808538b8-3c59-4b88-b622-35c85df40b2f	Helly	8150	t	2025-11-19 12:51:27.981	2025-11-19 12:51:27.981	7dbb577d-1103-4840-9d57-d9751760be9f
2073a1ad-9ed7-4137-893e-c1190235934e	Henesys	8004	t	2025-11-19 12:51:28.069	2025-11-19 12:51:28.069	7dbb577d-1103-4840-9d57-d9751760be9f
1a691b99-a5b2-40ed-9b05-7c2b8dcf62f1	Herb Town	8020	t	2025-11-19 12:51:28.157	2025-11-19 12:51:28.157	7dbb577d-1103-4840-9d57-d9751760be9f
0572a145-ecfa-4873-9574-b0375fefb4bc	Horntail	8123	t	2025-11-19 12:51:28.244	2025-11-19 12:51:28.244	7dbb577d-1103-4840-9d57-d9751760be9f
7f564aec-6aa1-425d-8e5b-47267f5ff586	Inverted City	8034	t	2025-11-19 12:51:28.331	2025-11-19 12:51:28.331	7dbb577d-1103-4840-9d57-d9751760be9f
79d90113-88a1-45ac-a950-a034166c8c64	Irene Forest	8085	t	2025-11-19 12:51:28.418	2025-11-19 12:51:28.418	7dbb577d-1103-4840-9d57-d9751760be9f
ae708ddf-6ccd-4f5e-acc6-c66de8ab7b0d	Iron Hog	8053	t	2025-11-19 12:51:28.506	2025-11-19 12:51:28.506	7dbb577d-1103-4840-9d57-d9751760be9f
655ba76a-986c-4609-9807-52541baf54b9	Jr. Cellion	8183	t	2025-11-19 12:51:28.593	2025-11-19 12:51:28.593	7dbb577d-1103-4840-9d57-d9751760be9f
6dd4b911-5bc7-40c7-bbe8-463e8368dcdf	Jr. Grupin	8185	t	2025-11-19 12:51:28.679	2025-11-19 12:51:28.679	7dbb577d-1103-4840-9d57-d9751760be9f
a79e746c-1b18-4355-b2c8-b407fa9ac47d	Jr. Lioner	8184	t	2025-11-19 12:51:28.766	2025-11-19 12:51:28.766	7dbb577d-1103-4840-9d57-d9751760be9f
9aa98b1f-0209-45d3-af37-a31e0239b7ff	Jr. Wraith	8065	t	2025-11-19 12:51:28.854	2025-11-19 12:51:28.854	7dbb577d-1103-4840-9d57-d9751760be9f
cfe6e767-0fa4-44df-9899-6765f497efa0	Kerning City	8082	t	2025-11-19 12:51:28.942	2025-11-19 12:51:28.942	7dbb577d-1103-4840-9d57-d9751760be9f
594919a4-92da-40a3-a031-f5bc0b6770da	King Block Golem	8148	t	2025-11-19 12:51:29.03	2025-11-19 12:51:29.03	7dbb577d-1103-4840-9d57-d9751760be9f
40ef918f-888a-4b3a-9b8c-23bb359a03e8	King Bloctopus	8171	t	2025-11-19 12:51:29.119	2025-11-19 12:51:29.119	7dbb577d-1103-4840-9d57-d9751760be9f
4e1ff844-4457-48ee-90c5-60e4a7cea501	Kiyo	8145	t	2025-11-19 12:51:29.22	2025-11-19 12:51:29.22	7dbb577d-1103-4840-9d57-d9751760be9f
2acfddfe-c89c-4682-823f-f3f133b11e25	Kleis	8023	t	2025-11-19 12:51:29.308	2025-11-19 12:51:29.308	7dbb577d-1103-4840-9d57-d9751760be9f
f8b05518-2751-49bf-8b7a-b46ae8f2535b	Krappy	8169	t	2025-11-19 12:51:29.395	2025-11-19 12:51:29.395	7dbb577d-1103-4840-9d57-d9751760be9f
6ae21a83-e396-40ed-ba5b-3d9648bcb588	Krip	8072	t	2025-11-19 12:51:29.482	2025-11-19 12:51:29.482	7dbb577d-1103-4840-9d57-d9751760be9f
a9ef8236-218e-4fb2-a648-7d52fd99b270	Leafre	8016	t	2025-11-19 12:51:29.57	2025-11-19 12:51:29.57	7dbb577d-1103-4840-9d57-d9751760be9f
709a0059-d5bf-4155-bb80-ca4ba4d11064	Lena Strait	8090	t	2025-11-19 12:51:29.698	2025-11-19 12:51:29.698	7dbb577d-1103-4840-9d57-d9751760be9f
d5ba4683-36fa-437e-9bb2-6ce55e84378c	Lion Castle	8097	t	2025-11-19 12:51:29.786	2025-11-19 12:51:29.786	7dbb577d-1103-4840-9d57-d9751760be9f
1e178dfa-36cc-44af-a8be-1df0968db9c0	Lioner	8129	t	2025-11-19 12:51:29.873	2025-11-19 12:51:29.873	7dbb577d-1103-4840-9d57-d9751760be9f
d01e2962-1261-4dcd-9011-a612407e5b76	Lizardfolk Chief	8192	t	2025-11-19 12:51:29.961	2025-11-19 12:51:29.961	7dbb577d-1103-4840-9d57-d9751760be9f
2e84b12a-debc-43b1-b394-f256b6932c32	Lucida	8141	t	2025-11-19 12:51:30.049	2025-11-19 12:51:30.049	7dbb577d-1103-4840-9d57-d9751760be9f
350d4ab4-2245-4236-90c9-d289ead16b3d	Ludus	8013	t	2025-11-19 12:51:30.137	2025-11-19 12:51:30.137	7dbb577d-1103-4840-9d57-d9751760be9f
8259b11b-0129-44fb-a266-501aafe3a8e7	Lunar Pixie	8126	t	2025-11-19 12:51:30.224	2025-11-19 12:51:30.224	7dbb577d-1103-4840-9d57-d9751760be9f
0168a492-cf3c-4492-a798-b78c09040f58	Luster Pixie	8127	t	2025-11-19 12:51:30.311	2025-11-19 12:51:30.311	7dbb577d-1103-4840-9d57-d9751760be9f
4afa28df-285f-4087-b54d-6c226dae48e6	Magatia	8104	t	2025-11-19 12:51:30.398	2025-11-19 12:51:30.398	7dbb577d-1103-4840-9d57-d9751760be9f
a0006458-dc51-4c9b-b820-e647c3c4d2cd	Mano	8058	t	2025-11-19 12:51:30.485	2025-11-19 12:51:30.485	7dbb577d-1103-4840-9d57-d9751760be9f
1f76c2d8-38fd-4748-8626-68ace7576328	Maple Island	8002	t	2025-11-19 12:51:30.572	2025-11-19 12:51:30.572	7dbb577d-1103-4840-9d57-d9751760be9f
72607059-a60e-4964-aff6-92fa1f043979	Maple Village	8001	t	2025-11-19 12:51:30.66	2025-11-19 12:51:30.66	7dbb577d-1103-4840-9d57-d9751760be9f
9dc5ec71-133d-4a0d-bbd2-d3accf5e8899	Master Death Teddy	8060	t	2025-11-19 12:51:30.748	2025-11-19 12:51:30.748	7dbb577d-1103-4840-9d57-d9751760be9f
53a6a4fc-f7fd-4b73-85e8-548d35fe6b54	Minar Forest	8015	t	2025-11-19 12:51:30.836	2025-11-19 12:51:30.836	7dbb577d-1103-4840-9d57-d9751760be9f
533007d5-0697-480d-a230-b54c528173c5	Mirror World	8017	t	2025-11-19 12:51:30.923	2025-11-19 12:51:30.923	7dbb577d-1103-4840-9d57-d9751760be9f
74446b7b-8257-445b-ab24-6553e0a5a196	Miu Miu	8114	t	2025-11-19 12:51:31.01	2025-11-19 12:51:31.01	7dbb577d-1103-4840-9d57-d9751760be9f
bd9d9d54-6e5b-4c26-8921-bf138ee4c9ef	Mixed Golem	8200	t	2025-11-19 12:51:31.097	2025-11-19 12:51:31.097	7dbb577d-1103-4840-9d57-d9751760be9f
39c4e646-b748-44a4-b4e3-2dda4c0ce460	Morass	8039	t	2025-11-19 12:51:31.185	2025-11-19 12:51:31.185	7dbb577d-1103-4840-9d57-d9751760be9f
2bfc3c59-0e53-41b5-9274-83df9cec2ad2	Mu Lung	8105	t	2025-11-19 12:51:31.273	2025-11-19 12:51:31.273	7dbb577d-1103-4840-9d57-d9751760be9f
3d09e7be-488e-4fe3-bf84-29cda44bdcfb	Mushmom	8124	t	2025-11-19 12:51:31.36	2025-11-19 12:51:31.36	7dbb577d-1103-4840-9d57-d9751760be9f
0cb09085-71ea-4646-914a-c6aad98cc4d5	Mushroom City	8010	t	2025-11-19 12:51:31.446	2025-11-19 12:51:31.446	7dbb577d-1103-4840-9d57-d9751760be9f
7fdbd5d7-44ac-43f9-83d8-1fbb15521429	Mysterious Forest	8117	t	2025-11-19 12:51:31.533	2025-11-19 12:51:31.533	7dbb577d-1103-4840-9d57-d9751760be9f
9d209ec9-1e3c-4f9a-8f63-60f60243b240	Mysterious Island	8022	t	2025-11-19 12:51:31.62	2025-11-19 12:51:31.62	7dbb577d-1103-4840-9d57-d9751760be9f
a5da2514-5219-438f-9b6e-7491628dd7d9	Mysterious River	8033	t	2025-11-19 12:51:31.708	2025-11-19 12:51:31.708	7dbb577d-1103-4840-9d57-d9751760be9f
d17f1916-9e4e-40a1-9a27-59d08aaf67b0	Nependeath	8165	t	2025-11-19 12:51:31.795	2025-11-19 12:51:31.795	7dbb577d-1103-4840-9d57-d9751760be9f
f69b8dae-a709-435d-9aae-feb8048d8223	Obelisk	8019	t	2025-11-19 12:51:31.885	2025-11-19 12:51:31.885	7dbb577d-1103-4840-9d57-d9751760be9f
aedb33cb-6cde-4ac7-af06-1bf87b68439e	Orange Mushroom	8049	t	2025-11-19 12:51:31.972	2025-11-19 12:51:31.972	7dbb577d-1103-4840-9d57-d9751760be9f
55063410-757c-4f1c-ab2e-fc6eebaecd61	Orbis	8098	t	2025-11-19 12:51:32.059	2025-11-19 12:51:32.059	7dbb577d-1103-4840-9d57-d9751760be9f
60e306f7-2bc7-4cf5-a9c9-b70961b55966	Ore Muncher	8166	t	2025-11-19 12:51:32.147	2025-11-19 12:51:32.147	7dbb577d-1103-4840-9d57-d9751760be9f
64fe7eb5-afe6-4a9e-a655-028994e08fa6	Palethan	8025	t	2025-11-19 12:51:32.234	2025-11-19 12:51:32.234	7dbb577d-1103-4840-9d57-d9751760be9f
de439a41-9704-4e00-a307-6c8a54205c94	Panda Teddy	8156	t	2025-11-19 12:51:32.321	2025-11-19 12:51:32.321	7dbb577d-1103-4840-9d57-d9751760be9f
73cc3f28-55e3-4fc9-8852-1df38e34afb3	Perion	8081	t	2025-11-19 12:51:32.408	2025-11-19 12:51:32.408	7dbb577d-1103-4840-9d57-d9751760be9f
618f0d28-2b59-47cb-85af-587ab2edc2d3	Phantom Witch	8160	t	2025-11-19 12:51:32.495	2025-11-19 12:51:32.495	7dbb577d-1103-4840-9d57-d9751760be9f
0cb03b2d-fa3d-4911-bb55-dbde2b02e4a6	Pixie	8061	t	2025-11-19 12:51:32.582	2025-11-19 12:51:32.582	7dbb577d-1103-4840-9d57-d9751760be9f
a01a5f40-c342-4437-b695-f6f03ad2bbe8	Planey	8149	t	2025-11-19 12:51:32.669	2025-11-19 12:51:32.669	7dbb577d-1103-4840-9d57-d9751760be9f
c093e380-dfeb-439c-98cc-2f9d04669eda	Primitive Boar	8059	t	2025-11-19 12:51:32.764	2025-11-19 12:51:32.764	7dbb577d-1103-4840-9d57-d9751760be9f
b769bafc-9e92-4c87-b67e-3c336ec79367	Propelly	8151	t	2025-11-19 12:51:32.851	2025-11-19 12:51:32.851	7dbb577d-1103-4840-9d57-d9751760be9f
7c5fe37b-0a91-4f1a-ae51-6def96246249	Ratz	8153	t	2025-11-19 12:51:32.94	2025-11-19 12:51:32.94	7dbb577d-1103-4840-9d57-d9751760be9f
c16ad586-9385-40a8-abb5-3c03cbcd61ca	Red Dragon	8077	t	2025-11-19 12:51:33.028	2025-11-19 12:51:33.028	7dbb577d-1103-4840-9d57-d9751760be9f
34057260-583d-4655-96dd-ffb2ea8db0cb	Red Kentaurus	8193	t	2025-11-19 12:51:33.115	2025-11-19 12:51:33.115	7dbb577d-1103-4840-9d57-d9751760be9f
70823d4c-435d-4d64-b8e7-b27a900c7911	Red Snail	8043	t	2025-11-19 12:51:33.202	2025-11-19 12:51:33.202	7dbb577d-1103-4840-9d57-d9751760be9f
04138bc8-d417-4103-8881-9bcfb711983e	Red Tube Slime	8180	t	2025-11-19 12:51:33.29	2025-11-19 12:51:33.29	7dbb577d-1103-4840-9d57-d9751760be9f
3369773d-cad9-4ace-906c-318a9dc851f6	Risell Squid	8182	t	2025-11-19 12:51:33.377	2025-11-19 12:51:33.377	7dbb577d-1103-4840-9d57-d9751760be9f
8a570df6-43f7-4d1c-88e5-2298ee8ee9a5	Rock Behemoth	8093	t	2025-11-19 12:51:33.465	2025-11-19 12:51:33.465	7dbb577d-1103-4840-9d57-d9751760be9f
3d095bdf-f52e-485d-9cfd-e6c76e00c93e	Royal Fairy	8162	t	2025-11-19 12:51:33.554	2025-11-19 12:51:33.554	7dbb577d-1103-4840-9d57-d9751760be9f
784c4047-1d87-460b-8f3a-bd08fed771a4	Sakura City	8007	t	2025-11-19 12:51:33.642	2025-11-19 12:51:33.642	7dbb577d-1103-4840-9d57-d9751760be9f
9ea14b70-b0a1-4d45-84a2-8d1d1e8a69bf	Sand Dwarf	8147	t	2025-11-19 12:51:33.729	2025-11-19 12:51:33.729	7dbb577d-1103-4840-9d57-d9751760be9f
706d51e9-a780-4085-845f-38365e5103af	Scarf Plead	8144	t	2025-11-19 12:51:33.817	2025-11-19 12:51:33.817	7dbb577d-1103-4840-9d57-d9751760be9f
7b5f9c8e-9d67-4eec-8936-02b6b562ea76	Scorpion	8146	t	2025-11-19 12:51:33.904	2025-11-19 12:51:33.904	7dbb577d-1103-4840-9d57-d9751760be9f
e8d26e98-68c6-4535-8232-d2e8284d627b	Sea of Genesis	8119	t	2025-11-19 12:51:33.992	2025-11-19 12:51:33.992	7dbb577d-1103-4840-9d57-d9751760be9f
e99cd0e6-48ef-4ee0-a517-7ef84e4af921	Seacle	8070	t	2025-11-19 12:51:34.08	2025-11-19 12:51:34.08	7dbb577d-1103-4840-9d57-d9751760be9f
26d57b2f-765d-43e6-8756-a4ecec1dc8e7	Seagull Slime	8137	t	2025-11-19 12:51:34.167	2025-11-19 12:51:34.167	7dbb577d-1103-4840-9d57-d9751760be9f
a87624a8-e116-44f2-b106-a29f5435c868	Seashell Slime	8140	t	2025-11-19 12:51:34.254	2025-11-19 12:51:34.254	7dbb577d-1103-4840-9d57-d9751760be9f
d05d553b-caf6-42b5-9ed2-c9857c8ae59f	Serass	8040	t	2025-11-19 12:51:34.342	2025-11-19 12:51:34.342	7dbb577d-1103-4840-9d57-d9751760be9f
8e725c4d-587d-4784-9639-991f7b46331c	Sertiu	8116	t	2025-11-19 12:51:34.43	2025-11-19 12:51:34.43	7dbb577d-1103-4840-9d57-d9751760be9f
9bf89c8f-972a-452e-86eb-2d2b965d0671	Seruf	8069	t	2025-11-19 12:51:34.52	2025-11-19 12:51:34.52	7dbb577d-1103-4840-9d57-d9751760be9f
357ec904-a41f-435e-a9fe-3977d93e7966	Shade	8067	t	2025-11-19 12:51:34.608	2025-11-19 12:51:34.608	7dbb577d-1103-4840-9d57-d9751760be9f
b17b3a7a-d2f9-475c-bea0-b6c2faa157d2	Six Roads	8011	t	2025-11-19 12:51:34.695	2025-11-19 12:51:34.695	7dbb577d-1103-4840-9d57-d9751760be9f
08b1d824-bcce-4a78-8b7c-a831563529b3	Skeleton Commander	8164	t	2025-11-19 12:51:34.782	2025-11-19 12:51:34.782	7dbb577d-1103-4840-9d57-d9751760be9f
ea114be8-461a-49a9-9fe7-720e68fd7754	Skeleton Dragon	8080	t	2025-11-19 12:51:34.869	2025-11-19 12:51:34.869	7dbb577d-1103-4840-9d57-d9751760be9f
2b2813cd-50a8-441d-98d9-7956b902cd02	Slime	8045	t	2025-11-19 12:51:34.956	2025-11-19 12:51:34.956	7dbb577d-1103-4840-9d57-d9751760be9f
20db3ea8-5e4a-42fa-8932-15a9e6b69b48	Slime King	8121	t	2025-11-19 12:51:35.043	2025-11-19 12:51:35.043	7dbb577d-1103-4840-9d57-d9751760be9f
52aa6012-92a2-4be0-8d2b-6a4bb8373cac	Snail	8041	t	2025-11-19 12:51:35.13	2025-11-19 12:51:35.13	7dbb577d-1103-4840-9d57-d9751760be9f
11905eef-1882-41ea-8db4-7e80cd6e0dbe	Snow Canyon	8099	t	2025-11-19 12:51:35.217	2025-11-19 12:51:35.217	7dbb577d-1103-4840-9d57-d9751760be9f
5d3ca0ea-f1c6-49ee-a27b-398f22851ca1	Soul Teddy	8173	t	2025-11-19 12:51:35.307	2025-11-19 12:51:35.307	7dbb577d-1103-4840-9d57-d9751760be9f
c8a6c148-6d4d-4f81-b6ea-a235275ccfb1	Spirit Viking	8068	t	2025-11-19 12:51:35.396	2025-11-19 12:51:35.396	7dbb577d-1103-4840-9d57-d9751760be9f
8aa1495c-98d6-4723-8480-8807d91f654e	Squid	8075	t	2025-11-19 12:51:35.483	2025-11-19 12:51:35.483	7dbb577d-1103-4840-9d57-d9751760be9f
44a7697f-4a04-4eaf-9c50-7d828ec3cec9	Star Pixie	8125	t	2025-11-19 12:51:35.57	2025-11-19 12:51:35.57	7dbb577d-1103-4840-9d57-d9751760be9f
ef2d3e6b-167c-4324-8d07-1658d0292ad6	Star Tower	8006	t	2025-11-19 12:51:35.659	2025-11-19 12:51:35.659	7dbb577d-1103-4840-9d57-d9751760be9f
a2b2d528-cbe7-466f-ac25-2408a7903ed5	Starfish Slime	8139	t	2025-11-19 12:51:35.749	2025-11-19 12:51:35.749	7dbb577d-1103-4840-9d57-d9751760be9f
4b8204f9-fcee-403e-84d2-ca22070a3425	Stone Golem	8051	t	2025-11-19 12:51:35.84	2025-11-19 12:51:35.84	7dbb577d-1103-4840-9d57-d9751760be9f
6943d825-5ef7-4026-924c-d5542998d11d	Stumpy	8062	t	2025-11-19 12:51:35.93	2025-11-19 12:51:35.93	7dbb577d-1103-4840-9d57-d9751760be9f
86752776-c230-4e9a-8bd9-e84289250c2d	Surgeon Eye	8134	t	2025-11-19 12:51:36.018	2025-11-19 12:51:36.018	7dbb577d-1103-4840-9d57-d9751760be9f
61207540-fab6-4bf1-8cc5-3f048d554519	Tale Village	8012	t	2025-11-19 12:51:36.108	2025-11-19 12:51:36.108	7dbb577d-1103-4840-9d57-d9751760be9f
deefb1c2-c862-4f99-94b8-f35af382b3a1	Tara Forest	8092	t	2025-11-19 12:51:36.196	2025-11-19 12:51:36.196	7dbb577d-1103-4840-9d57-d9751760be9f
e5b259b0-3cc8-422b-b0ce-4b530987ef9f	Temple of Gods	8026	t	2025-11-19 12:51:36.283	2025-11-19 12:51:36.283	7dbb577d-1103-4840-9d57-d9751760be9f
2fcc7436-72fd-4941-a8ac-3c882e0d0b6d	Temple of Time	8107	t	2025-11-19 12:51:36.372	2025-11-19 12:51:36.372	7dbb577d-1103-4840-9d57-d9751760be9f
4be1f161-32a3-44d1-87f5-091f89317658	Teru Efi	8111	t	2025-11-19 12:51:36.459	2025-11-19 12:51:36.459	7dbb577d-1103-4840-9d57-d9751760be9f
643d7310-536c-422b-9b22-9ba2d4ef8fd6	Time Tower	8014	t	2025-11-19 12:51:36.546	2025-11-19 12:51:36.546	7dbb577d-1103-4840-9d57-d9751760be9f
60258d3c-5b2f-48b9-9da0-c94482b1ed62	Tower of Babel	8037	t	2025-11-19 12:51:36.633	2025-11-19 12:51:36.633	7dbb577d-1103-4840-9d57-d9751760be9f
089f7bb8-9a43-4a62-826d-a52dfb0f9d2f	Toy Trojan	8152	t	2025-11-19 12:51:36.72	2025-11-19 12:51:36.72	7dbb577d-1103-4840-9d57-d9751760be9f
5f46e430-3da2-4ec0-8e47-15b1bd8437a1	Tulun City	8028	t	2025-11-19 12:51:36.809	2025-11-19 12:51:36.809	7dbb577d-1103-4840-9d57-d9751760be9f
5d9035db-b9ce-4a2b-b679-a3c7c6754770	Tyrant Castle	8113	t	2025-11-19 12:51:36.899	2025-11-19 12:51:36.899	7dbb577d-1103-4840-9d57-d9751760be9f
4b73b77d-0881-4f3c-8a56-aa2de4ef0a84	Undersea Tower	8101	t	2025-11-19 12:51:36.986	2025-11-19 12:51:36.986	7dbb577d-1103-4840-9d57-d9751760be9f
6ec26d8e-e4de-413f-aa2b-c7d1fba7dba8	Unicorn	8055	t	2025-11-19 12:51:37.074	2025-11-19 12:51:37.074	7dbb577d-1103-4840-9d57-d9751760be9f
674eb8d8-be29-4336-9a7b-aac69134e8af	Verne Mines	8091	t	2025-11-19 12:51:37.163	2025-11-19 12:51:37.163	7dbb577d-1103-4840-9d57-d9751760be9f
01341699-f4b2-4ec2-b67a-3cd04ed92379	Violet Clam Slime	8179	t	2025-11-19 12:51:37.251	2025-11-19 12:51:37.251	7dbb577d-1103-4840-9d57-d9751760be9f
018469b7-b582-4b46-a4a6-06015c5339b5	Wild Boar	8052	t	2025-11-19 12:51:37.341	2025-11-19 12:51:37.341	7dbb577d-1103-4840-9d57-d9751760be9f
19757364-6222-4b62-b30b-6679882342ce	Wraith	8066	t	2025-11-19 12:51:37.432	2025-11-19 12:51:37.432	7dbb577d-1103-4840-9d57-d9751760be9f
19b28345-5d77-4382-a887-3207a450bbb0	Yaxus	8032	t	2025-11-19 12:51:37.521	2025-11-19 12:51:37.521	7dbb577d-1103-4840-9d57-d9751760be9f
64f58a9f-d056-4174-b1d0-dd94b322cc7d	Zakum	8136	t	2025-11-19 12:51:37.611	2025-11-19 12:51:37.611	7dbb577d-1103-4840-9d57-d9751760be9f
a8a3873d-faac-4390-a314-ece4b04250b8	Zombie Mushmom	8198	t	2025-11-19 12:51:37.7	2025-11-19 12:51:37.7	7dbb577d-1103-4840-9d57-d9751760be9f
630f43f6-7855-4fbb-b3eb-c1bddb9005c6	Palm Tree Slime	8177	t	2025-11-19 12:51:37.79	2025-11-19 12:51:37.79	7dbb577d-1103-4840-9d57-d9751760be9f
209fdeed-0ec4-4773-9082-7ca05b2e5a9c	Elim 01	20001	t	2025-11-19 12:51:46.499	2025-11-19 12:51:46.499	ecb0a2de-5636-478b-86cb-6454ac5acbe4
e819ec54-367c-42bc-b65f-07e66173f5b9	Elim 02	20002	t	2025-11-19 12:51:46.587	2025-11-19 12:51:46.587	ecb0a2de-5636-478b-86cb-6454ac5acbe4
159b9141-f050-420f-9c73-f17cf241b5d6	Elim 03	20003	t	2025-11-19 12:51:46.674	2025-11-19 12:51:46.674	ecb0a2de-5636-478b-86cb-6454ac5acbe4
2a8eff03-5428-4d8c-99e0-2200768f57f6	Elim 04	20004	t	2025-11-19 12:51:46.76	2025-11-19 12:51:46.76	ecb0a2de-5636-478b-86cb-6454ac5acbe4
b16ce9fe-06a2-4d8b-b141-097d40df76f9	Elim 05	20005	t	2025-11-19 12:51:46.848	2025-11-19 12:51:46.848	ecb0a2de-5636-478b-86cb-6454ac5acbe4
fb484659-067c-4f4f-9111-4d4653be0fa4	Elim 06	20006	t	2025-11-19 12:51:46.934	2025-11-19 12:51:46.934	ecb0a2de-5636-478b-86cb-6454ac5acbe4
7c0d4888-d52b-4f1a-9427-580a1d42f082	Elim 07	20007	t	2025-11-19 12:51:47.022	2025-11-19 12:51:47.022	ecb0a2de-5636-478b-86cb-6454ac5acbe4
50f458b1-d8c0-45da-9deb-75ed6b545532	Elim 08	20008	t	2025-11-19 12:51:47.109	2025-11-19 12:51:47.109	ecb0a2de-5636-478b-86cb-6454ac5acbe4
fb29e363-69ea-4b18-a73f-54176d7b9935	Elim 09	20009	t	2025-11-19 12:51:47.197	2025-11-19 12:51:47.197	ecb0a2de-5636-478b-86cb-6454ac5acbe4
09b22022-0682-491f-b0bc-b13d432a3b94	Elim 10	20010	t	2025-11-19 12:51:47.284	2025-11-19 12:51:47.284	ecb0a2de-5636-478b-86cb-6454ac5acbe4
40fadc2d-fb34-452f-99d4-3e740b9a6709	Lime 01	20011	t	2025-11-19 12:51:47.371	2025-11-19 12:51:47.371	ecb0a2de-5636-478b-86cb-6454ac5acbe4
8e14d235-5e29-4d59-8ad0-5dae60a954cc	Lime 02	20012	t	2025-11-19 12:51:47.458	2025-11-19 12:51:47.458	ecb0a2de-5636-478b-86cb-6454ac5acbe4
435a5849-f35e-4516-ac32-ce9334e8f91f	Lime 03	20013	t	2025-11-19 12:51:47.545	2025-11-19 12:51:47.545	ecb0a2de-5636-478b-86cb-6454ac5acbe4
ec2c97f8-9d0a-491f-942c-2f0412d381ae	Lime 04	20014	t	2025-11-19 12:51:47.632	2025-11-19 12:51:47.632	ecb0a2de-5636-478b-86cb-6454ac5acbe4
9d89f3e8-397b-4315-afca-c85f5f3e2a7e	Lime 05	20015	t	2025-11-19 12:51:47.719	2025-11-19 12:51:47.719	ecb0a2de-5636-478b-86cb-6454ac5acbe4
d1f6c5a3-8f35-4d19-954a-69cc9e278cbf	Lime 06	20016	t	2025-11-19 12:51:47.807	2025-11-19 12:51:47.807	ecb0a2de-5636-478b-86cb-6454ac5acbe4
94a5df52-48bc-478c-814f-899911986ebc	Lime 07	20017	t	2025-11-19 12:51:47.894	2025-11-19 12:51:47.894	ecb0a2de-5636-478b-86cb-6454ac5acbe4
02ec3385-0f73-4974-b040-a5cb9a379da1	Lime 08	20018	t	2025-11-19 12:51:47.981	2025-11-19 12:51:47.981	ecb0a2de-5636-478b-86cb-6454ac5acbe4
2c437e58-8624-4af2-9ffe-547fc0632809	Lime 09	20019	t	2025-11-19 12:51:48.068	2025-11-19 12:51:48.068	ecb0a2de-5636-478b-86cb-6454ac5acbe4
03d04079-2ca5-4b8d-a73b-51629273f653	Lime 10	20020	t	2025-11-19 12:51:48.156	2025-11-19 12:51:48.156	ecb0a2de-5636-478b-86cb-6454ac5acbe4
c7492641-ba34-4c71-bf33-1cf13d108388	Thunderbird	13001	t	2025-11-19 12:51:50.402	2025-11-19 12:51:50.402	e14cd26f-d3af-4062-88a3-df8c4e776b46
2dd44d1d-9a6f-4774-a563-3e49bfa25e08	Ashwinder	13014	t	2025-11-19 12:51:50.489	2025-11-19 12:51:50.489	e14cd26f-d3af-4062-88a3-df8c4e776b46
f354bafa-1bac-4243-a076-914e5ccbaee9	Erumpent	13015	t	2025-11-19 12:51:50.576	2025-11-19 12:51:50.576	e14cd26f-d3af-4062-88a3-df8c4e776b46
740b0741-57d0-4c68-a2d8-b31901aa0500	Sphinx	13016	t	2025-11-19 12:51:50.663	2025-11-19 12:51:50.663	e14cd26f-d3af-4062-88a3-df8c4e776b46
2eaed2d7-2f6c-442e-ac4d-ae78a9248b19	Rougarou	13017	t	2025-11-19 12:51:50.75	2025-11-19 12:51:50.75	e14cd26f-d3af-4062-88a3-df8c4e776b46
e59ad7cf-7414-41bd-8ffa-1d5cb930c6bb	Kelpie	13019	t	2025-11-19 12:51:50.837	2025-11-19 12:51:50.837	e14cd26f-d3af-4062-88a3-df8c4e776b46
b9ef4bc4-9ea7-4cf3-ae0a-0791c4d8eca0	Asia	10521	t	2025-11-19 12:51:52.288	2025-11-19 12:51:52.288	9afd2a92-41d2-4066-a411-fa4a619ade2f
3ae488c1-f338-45d5-af57-8398a189d482	Japan	10501	t	2025-11-19 12:51:52.376	2025-11-19 12:51:52.376	9afd2a92-41d2-4066-a411-fa4a619ade2f
cb24b322-fe66-4307-948d-785bbb481c99	Korea	10511	t	2025-11-19 12:51:52.463	2025-11-19 12:51:52.463	9afd2a92-41d2-4066-a411-fa4a619ade2f
23f3d2ff-4dce-43f1-b721-5f87885971c3	North America	10531	t	2025-11-19 12:51:52.551	2025-11-19 12:51:52.551	9afd2a92-41d2-4066-a411-fa4a619ade2f
c6c878ac-293f-4f3f-a775-a08162d22616	Europe	10541	t	2025-11-19 12:51:52.637	2025-11-19 12:51:52.637	9afd2a92-41d2-4066-a411-fa4a619ade2f
0b096b7a-bafc-4d5c-b09a-925de6e84607	South East Asia	85	t	2025-11-19 12:52:00.397	2025-11-19 12:52:00.397	e9a182be-07a2-489c-96d5-b74c7365fe2e
f1faf468-1433-4253-817d-47d708bc20e0	Global	84	t	2025-11-19 12:52:00.489	2025-11-19 12:52:00.489	e9a182be-07a2-489c-96d5-b74c7365fe2e
ac53a1b4-3c0a-469b-9f3e-ddd04a1449c4	Japan	81	t	2025-11-19 12:52:00.576	2025-11-19 12:52:00.576	e9a182be-07a2-489c-96d5-b74c7365fe2e
6b012157-cc46-4bb8-97b2-e22861d0b092	Korea	83	t	2025-11-19 12:52:00.663	2025-11-19 12:52:00.663	e9a182be-07a2-489c-96d5-b74c7365fe2e
bd3f10f2-878f-45b7-9f06-3564f18fd3f3	North America	82	t	2025-11-19 12:52:00.75	2025-11-19 12:52:00.75	e9a182be-07a2-489c-96d5-b74c7365fe2e
da82b15a-fa39-4646-8024-09dda8dc0b38	Eternal Love	EL	t	2025-11-19 12:52:02.293	2025-11-19 12:52:02.293	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
3f9e9743-b10e-40fb-9a28-790f7b351acd	Midnight Party	MP	t	2025-11-19 12:52:02.381	2025-11-19 12:52:02.381	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
d661df54-ce7d-414d-9928-9f40471fe140	Memory of Faith	MF	t	2025-11-19 12:52:02.468	2025-11-19 12:52:02.468	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
aac2b415-5663-4403-bc6e-68aded85deb3	Valhalla Glory	VG	t	2025-11-19 12:52:02.556	2025-11-19 12:52:02.556	d43f9aaf-f5f9-40bd-a409-e4055d3c28ac
15c02836-ed34-4a47-9910-b8c920284446	FRIGG	1	t	2025-11-19 12:52:09.639	2025-11-19 12:52:09.639	40f6f086-ee98-401a-85d7-a4cf7a8de687
643ea760-164b-4908-b3ec-8080e53c8962	CELENA	2	t	2025-11-19 12:52:09.726	2025-11-19 12:52:09.726	40f6f086-ee98-401a-85d7-a4cf7a8de687
8742efcd-d598-40d2-9e39-197dac68e4bc	RUBENS	3	t	2025-11-19 12:52:09.813	2025-11-19 12:52:09.813	40f6f086-ee98-401a-85d7-a4cf7a8de687
7e5bbaee-7a58-48c7-8655-79a718323ec4	MARUN	4	t	2025-11-19 12:52:09.9	2025-11-19 12:52:09.9	40f6f086-ee98-401a-85d7-a4cf7a8de687
ecc4cd58-9687-4aea-9a86-6781cd29ed73	AMELIA	5	t	2025-11-19 12:52:09.988	2025-11-19 12:52:09.988	40f6f086-ee98-401a-85d7-a4cf7a8de687
61cbb727-1cec-4ff3-adb4-3399a52bedf2	NAEZ	6	t	2025-11-19 12:52:10.074	2025-11-19 12:52:10.074	40f6f086-ee98-401a-85d7-a4cf7a8de687
984c30ff-14f4-4a16-acc3-b9a829002143	KHRON	7	t	2025-11-19 12:52:10.162	2025-11-19 12:52:10.162	40f6f086-ee98-401a-85d7-a4cf7a8de687
feb7fe36-854f-45ac-bac3-e2ce7b422b50	ROZE	8	t	2025-11-19 12:52:10.249	2025-11-19 12:52:10.249	40f6f086-ee98-401a-85d7-a4cf7a8de687
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
cjLRHzVdZan7Um5NAoGS9PbEAjJEQccv	2025-11-01 09:02:10.875	mke8A01tQekMcn6OaaBH2VSBz2ZKksrN	2025-10-25 09:02:10.876	2025-10-25 09:02:10.876			cXDYy0ikduydWOeiSmLB6SV2HIIFMqes
rURDZjxgJQcsAAEupWmhRxyLuhUPRG9t	2025-11-01 09:02:41.103	9RahSKqC8BTZvxxZujixe8vb6iKGeSrO	2025-10-25 09:02:41.103	2025-10-25 09:02:41.103			cXDYy0ikduydWOeiSmLB6SV2HIIFMqes
2BcyXNXrg0VnMuSW1Qea0mIsGYbFGASE	2025-10-13 11:06:41.424	qB7fAkV9iz9tOKfNjyiGHcRjKtRyy616	2025-10-06 11:06:41.425	2025-10-06 11:06:41.425	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	KFnvOzIRi0AHl81vcQO2vD0jy93kzBP5
apv0WIvhuaAlikQnyy6EZpDLiUb7C4P5	2025-10-14 11:44:36.28	QUx4N2A8Tpme7XKBwUwQUoR2rOL9esnY	2025-10-06 11:29:22.52	2025-10-07 11:44:36.28	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv
WrxW5bG9W8yFVi9js5Plvf8PplDsa1J6	2025-10-15 05:25:23.477	zdoKjSoo2eXdHl3TFM51vlBdLR3pA3Bg	2025-10-06 11:20:30.497	2025-10-08 05:25:23.477	58.10.200.239	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
gwjO94GXVGfNhdCVi29QXHgq62HDwAzi	2025-10-15 11:38:57.755	EzNjQDuiSqJrbdjmJUzrmi6G4yRrWD4S	2025-10-07 10:02:03.622	2025-10-08 11:38:57.755	1.46.221.146	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv
HUWGOA6oCqsHjKrpzQXpunjTJoR3XftY	2025-10-16 05:17:39.78	GxFicf1mfrvAAQqOduPvsY1EjDvFFOsx	2025-10-07 10:25:25.351	2025-10-09 05:17:39.78	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
6tdTBq2GMzvizvpLznSAfZ8EiY8b2st2	2025-10-27 11:48:38.66	h8LMa5uLX10tluazEjwTZ1gg9lVU7hPn	2025-10-20 11:48:38.66	2025-10-20 11:48:38.66	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	l4V98TiNEXefmfEnHHreuNKlEq7ApSmr
7NgxF7RI21UmnAWVmHF3CyelpaQxKKKL	2025-10-17 11:01:44.98	zx6S6bFfjVGe3sxZpvDUS64KQvGomsjb	2025-10-08 04:09:53.569	2025-10-10 11:01:44.98	1.46.221.146	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.41 Mobile/15E148 Safari/604.1	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
YzAXl02ESYwtPdJoQHtSmSqlc6ptLggN	2025-11-01 15:55:23.707	1CNM9wjs6AaKufqovj1Jy3QdDfePkx8y	2025-10-25 15:55:23.707	2025-10-25 15:55:23.707	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
MCnJIpcVZZS1fqgvNAE6xMc6jxbJpNrw	2025-10-26 12:23:21.359	0NTG3Fsp2NQKmbidiVPeEvtq5tL3C8F8	2025-10-19 12:23:21.359	2025-10-19 12:23:21.359	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
D4iUZj2wo0AmvVHjSbmqOpBvzbadwVJb	2025-11-02 16:16:40.936	gNRi03P6KcVrGuJwgffDjBGddFUMQ2DG	2025-10-26 16:16:40.936	2025-10-26 16:16:40.936	49.237.8.239	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
tULUdemdqLrTcmQKUvT53VEPPeOKLiAM	2025-11-02 17:02:53.691	gUNccPPjxWUkRzhgYGSA2s4yeIHF4WET	2025-10-26 17:02:53.692	2025-10-26 17:02:53.692	49.237.8.239	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
b5eKUWRCaKAU0dkJ9dbye3H5p8Q2FfhA	2025-11-03 06:26:06.052	5f34tNHOAvcHJTXuBjJWVfLCQnfiBheB	2025-10-27 06:26:06.052	2025-10-27 06:26:06.052	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
QP7ENoCxncgIDhsj2lNxp34jO8s7lNmR	2025-11-03 11:52:25.551	Tw50LdnVvBgF7VeKbLZRkubYQo0vTBIa	2025-10-27 11:52:25.551	2025-10-27 11:52:25.551	223.24.162.86	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
iSY1yhnNqzbTefJaeFrtPcd5uX41eGDg	2025-11-08 11:57:13.691	LosUckqVcbRv8PX5JpLc3ntji2H0NqGl	2025-10-25 15:56:04.61	2025-11-01 11:57:13.691	1.46.209.149	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv
eAVXXWa42EkurRzM5WfoLgUvYs0GUQ1A	2025-11-05 13:54:14.022	6nL7Z7qrxVp2NChbgy7dJBp14eCYvUH7	2025-10-29 13:54:14.023	2025-10-29 13:54:14.023	223.24.63.82	Mozilla/5.0 (iPhone; CPU iPhone OS 17_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/391.0.820341064 Mobile/15E148 Safari/604.1	bmuURX7ZswSETG3oV3Eczu7Dv9XOcSTt
BfMQWPcjFCFnsQP9xiH8bV0TzjYzn62q	2025-10-29 17:17:20.729	A26vWJm8aG8kS5TUkyjZBeUtRIaLQJq2	2025-10-22 17:17:20.73	2025-10-22 17:17:20.73	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
MLSMAxe84MV1TfkOxB6Pw90suZ2bBTux	2025-10-30 09:52:01.99	R3WcKFVHStgFk2Z13kZf4Bb8L8C6Lk4X	2025-10-20 10:07:31.205	2025-10-23 09:52:01.99	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv
DGN9m5NnMWtFo5SdzAYxSgGf3QYXJGc1	2025-10-31 09:21:57.953	i7w4qQujFRxAaKs8qAeKkZlm8veeuxO5	2025-10-24 09:21:57.953	2025-10-24 09:21:57.953	223.206.223.194	Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/391.0.820341064 Mobile/15E148 Safari/604.1	DkC6JUXnfpmTddUNpPsgp1fPALT5GaWW
rIrGm26S6HyI7dSYOFcUEW4KxjvNyJkB	2025-10-31 09:24:54.106	Q8J2INfJnKRLkoKCz7ad3P4bfplqpkG6	2025-10-24 09:24:54.107	2025-10-24 09:24:54.107	223.206.223.194	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1	DkC6JUXnfpmTddUNpPsgp1fPALT5GaWW
Xu3pgo1gS3jitZvYTKEU35Jbl80F3RW2	2025-10-31 10:10:50.65	6fYnYrFI3vTYi4UaiBl2jmGJe6MIMx0B	2025-10-24 10:10:50.65	2025-10-24 10:10:50.65	58.11.30.32	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	nXq0KBD6BKMhkgcl3pWwUXmv8942a4vS
wOrUCnFjxaczdEoIy4su1WfmS2jnjBT2	2025-10-31 10:44:37.694	wjiHoW9Mvx4m0aA9hkNM15hf5e0SCOPg	2025-10-24 10:44:37.694	2025-10-24 10:44:37.694	1.46.10.93	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	qH5c3XuAAd7NaT3U2bwxCotjchA9gaor
l9TihDyOdXYJQyUSvE1tDsAtZ92aZQqf	2025-10-31 14:49:51.187	REJfM6rnoKSTcUjmYhHoUZVqsVj0JBvk	2025-10-24 14:49:51.187	2025-10-24 14:49:51.187	49.237.32.163	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
J4T0sVfnxv4ivXzBLSRi3JW21aLvXgAH	2025-10-31 16:14:28.472	1ijGHbqUEkowc2OKNNxplqAJZeT5ET03	2025-10-24 16:14:28.473	2025-10-24 16:14:28.473			DXt4LVJradCTh8GHX3ZS2Nz80wxpGmbF
Qkpv9ltic7crhzuSe5BAcoR0hIggjw7I	2025-11-07 10:42:12.377	2Ia2ohqTrjoAFPf1CvfGoa3tEks5f9BQ	2025-10-31 10:42:12.377	2025-10-31 10:42:12.377	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
3OET6T9WpQALqBnwf4m14aVDSwnXVG5t	2025-11-07 11:08:13.19	YJNZNcxuh2q10fJHa6O1VsJLtb3Nf02F	2025-10-31 11:08:13.191	2025-10-31 11:08:13.191	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv
GMG4nb8wRIWZekm89syMnWeAboQAP0my	2025-11-07 11:28:45.596	js8HZkyOdlt4DAq9wREo0o7tGXiM3qaH	2025-10-31 11:28:45.597	2025-10-31 11:28:45.597	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
SDVib4iTZRsgSmGPmh4ympobZ0xsd721	2025-11-07 14:24:49.319	VJK3H8Xe2MKaUe0Mi0UI2GZhcXqglP8p	2025-10-28 12:48:53.294	2025-10-31 14:24:49.319	1.47.30.11	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
9eF4lQQpxDWhQirKXqsJqDuM9VWhhlYS	2025-11-09 18:34:22.346	i4ofl8X598qq5JUzXYPaEY2PdP1nyORB	2025-11-02 18:34:22.346	2025-11-02 18:34:22.346	223.24.190.68	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
SaasooEE1QUFCN7oebdkxOyPuBcDxPDk	2025-11-12 08:08:36.06	jtjQDz7GUTSfEYkKwDPBpl375rUkHLpk	2025-11-05 08:08:36.06	2025-11-05 08:08:36.06	27.55.83.121	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	l5i3W5iRJBwGO002ceSUGQJBWoFEsBwY
Qe5PHTeybvEpO9dEKe0MtKIBduCTb36I	2025-11-12 13:38:58.77	WJ2epW97HaElZjVLJgZxL29AOpkCPkkl	2025-10-31 11:34:46.651	2025-11-05 13:38:58.77	1.47.30.11	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
J4CwS70FtBR9pYamXIrhb6wKzkZUD2Hv	2025-11-15 11:47:14.197	KQSNeXIO0dFkvcjV1nnIpGotqLclDm1A	2025-11-06 11:06:53.438	2025-11-08 11:47:14.197	171.6.243.27	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	o1JiI5J8Qqs2TGyPVYlcra86zuYTzawp
7eTd1sE5DlJV8U3F0viGEzNKc0FlU33V	2025-11-26 12:01:27.499	zCwnlCPSzNjIkGUBFJ6iBODdzMtN2O2n	2025-11-19 12:01:27.499	2025-11-19 12:01:27.499	49.237.22.146	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
rZavwUk4DfX3M0TuLvRt591FPva0IuLG	2025-11-16 17:09:39.235	Flq2wryzzJi2rVObt668gy6RpZlWpG6O	2025-11-09 17:09:39.235	2025-11-09 17:09:39.235	1.46.20.85	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.7444.128 Mobile/15E148 Safari/604.1	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
hosY1tOo9OwsrZRsvHZVEo0wEQizznEY	2025-11-19 04:21:56.95	TDVeW7Uf59c30KJF0snsWV6vj9ePK58B	2025-11-12 04:21:56.95	2025-11-12 04:21:56.95	27.55.77.80	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
eKajUBCu8Tf7h97VwpmMn2TDCGzEpY5B	2025-11-20 13:24:59.995	79xDZjk5bhw5h1L0HHtiUhVHZCjwWmBU	2025-11-13 13:24:59.995	2025-11-13 13:24:59.995	223.24.63.27	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
OnE6wsJu0NEZXd4JDXdtaS512a9zATu7	2025-11-21 10:59:22.216	4hc9tF3WZqb8itVIdyZOnVuej6IwxGqs	2025-11-12 13:41:17.941	2025-11-14 10:59:22.216	49.230.99.183	Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1	tC1i6hUHeZ1quzsGB9EsxxyGEi1I7LbP
MXs0959FR2cWU5gy8lvYX5zIdonw9pxd	2025-11-22 15:01:29.597	QV7EdnX18DAIB0RpWjX05qIOyHOZjIZQ	2025-11-15 15:01:29.597	2025-11-15 15:01:29.597			U4JFVaPgAVAw9YmwX5kwK7cdtdIhoB8m
xCKKdzYP7GIDZSF8OQEO9whpQf5bMN1F	2025-11-22 15:01:37.461	224ZfVEJ2D0ogPTqmtQPW6YlZtQndbI1	2025-11-15 15:01:37.461	2025-11-15 15:01:37.461			U4JFVaPgAVAw9YmwX5kwK7cdtdIhoB8m
gVfCBruD8xa1mK3WUnp9V7mCEYka7Jws	2025-11-23 14:29:18.23	zghMMmzjnyTIoSBSN1XDhtdirvnVDJRU	2025-11-16 14:29:18.231	2025-11-16 14:29:18.231	49.48.229.199	Mozilla/5.0 (iPhone; CPU iPhone OS 26_1_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.7444.148 Mobile/15E148 Safari/604.1	DKRL5rZgbDkKoUiVuhOb1sJ8Id6T7GmD
wSoEzzOUeOY2anzPZrZkXZgdypsVY3SZ	2025-11-25 17:31:36.496	OgmGEVMSS4WfcJpmNpoAUiTlL8Ghvzrx	2025-11-18 17:31:36.496	2025-11-18 17:31:36.496	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
jo85Vcnm6fMxe5te8ZTvnOgfdaHuc34V	2025-11-26 11:28:40.964	XPjV9CRWIri2pqkFSFgyfYJMRpC3a6LY	2025-11-19 11:28:40.965	2025-11-19 11:28:40.965	223.24.169.155	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
t4fozmSHo91Qxw3hBUM1NjXAepSFwdti	2025-11-26 11:32:32.549	KsrDvEvyx1n55Sq8IQ7rG3sA2kG4FeCS	2025-11-19 11:32:32.55	2025-11-19 11:32:32.55	223.24.169.155	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
GhrnVq3AfyESkMyHjc7JfYisToycpDdo	2025-11-26 11:36:37.384	YnkLk9JVaXTNralLXEmISeAJod6cFGrn	2025-11-19 11:36:37.384	2025-11-19 11:36:37.384	49.237.22.146	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
09RbRJrHjgoz41l14F3VNyWxoZ7q7mp0	2025-11-26 11:40:24.463	h9SqMjbxaiH53EeDJjVSn7g1VsmFDb0G	2025-11-19 11:40:24.463	2025-11-19 11:40:24.463	49.237.22.146	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1
F8IP2DVZJN3wJfSE7iS9xEWJVtzSIkLA	2025-11-26 13:37:01.517	XAhh8zsW54zWmS9twdI9TvNCe4qznQh6	2025-11-17 09:17:43.031	2025-11-19 13:37:01.517		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ
lLLTe22EmkFuT7HcEzaYGcGuML75M40z	2025-11-29 13:53:23.706	ZGZHAJ7ALhWGXwhIoxph9AMrrR20KASe	2025-11-22 13:53:23.706	2025-11-22 13:53:23.706	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
hKFmfzinlvryyUM33r0uYKzJLttmeaKw	2025-11-29 14:54:20.757	AbA2FOdBgg9jnbCaTKJPbmOVToWepBAo	2025-11-22 14:54:20.757	2025-11-22 14:54:20.757	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
bzPyXShC64ZnFEOKJTdrmqDLAmOwoZ97	2025-11-30 00:48:51.798	iL3QTQTpzRZCkdakj3CJeMMOhNLcsQu8	2025-11-23 00:48:51.799	2025-11-23 00:48:51.799	49.237.185.234	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	OHRGiRcDszNfSBeSISwv0IeWByHqExJo
xf6aO6Qj2AjZidDvMUmQLsU7U63FJ4n1	2025-11-30 11:22:07.522	1OI5BefCFfNsSdJISt81zmk7mwDjG2h1	2025-11-23 11:22:07.522	2025-11-23 11:22:07.522	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	KFnvOzIRi0AHl81vcQO2vD0jy93kzBP5
0ZWbuWmPC73wN4Dv9clzntMYe3T9vBiN	2025-11-30 12:08:26.378	BguCx2ZWj8Qy2ZIrfUI4BGD4Do8OKlIW	2025-11-23 12:08:26.379	2025-11-23 12:08:26.379	1.46.10.78	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.7444.148 Mobile/15E148 Safari/604.1	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
Z24Z1fhT0azv3uPDidikaRJyzhNjGouF	2025-11-30 12:10:44.792	DnFbIfin6t6A67gpipPqwnduIxBzGIc6	2025-11-23 12:10:44.792	2025-11-23 12:10:44.792	1.46.31.128	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.38 Mobile/15E148 Safari/604.1	M99B7kK5B66VgDKlphbFtYQqZMczZAKd
gQAeoRuKX8R6aqRI03BsSdkKo7V9SN6K	2025-11-30 12:20:54.351	EredrPoTc43v5FJ7OTxWoBJPfoeKybTh	2025-11-23 12:20:54.351	2025-11-23 12:20:54.351	58.10.196.45	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", balance, role) FROM stdin;
tC1i6hUHeZ1quzsGB9EsxxyGEi1I7LbP	Kwanjai Monkong	kwanjai1290@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocKfAUFDFpX86g-quY9KcznfVIQQF5ejKlwjebVDwo1-dVHbHg=s96-c	2025-11-12 13:41:17.086	2025-11-12 13:41:17.086	0	user
U4JFVaPgAVAw9YmwX5kwK7cdtdIhoB8m	freedom	freedom@gmail.com	f	\N	2025-11-15 15:01:28.664	2025-11-15 15:01:28.664	0	user
DkC6JUXnfpmTddUNpPsgp1fPALT5GaWW	พิมฤดี ช่างจักร	prdcj24@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocLLmEfIsQ8UF_XpW1qfRMSnYbAZdudouvVP7yM_d5DM7tjZQQ=s96-c	2025-10-24 09:21:57.073	2025-10-24 09:21:57.073	0	user
1bjRzHm7Dhu44vA3jUdNz1fFbfuiCkBv	ronnakrit cheinvichai	59superrichsol@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocLpsRIngFoiuxUar7Mas9KSN-zN_3vl6sSbkogG-q_nnLvZAg=s96-c	2025-10-06 11:03:57.539	2025-10-06 11:03:57.539	5	user
nXq0KBD6BKMhkgcl3pWwUXmv8942a4vS	HATSACSOT PIUBNIM	hatsacsotp@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocLve2vL5zRcqgbkc7e4imbceaUMQdtgvKnmCs_Q4u9JF2NGr5zi=s96-c	2025-10-24 10:10:49.781	2025-10-24 10:10:49.781	0	user
qH5c3XuAAd7NaT3U2bwxCotjchA9gaor	Puthat bubi	poppeezn@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocI2mIetqYl7cgzVZxqAKIzz4zdtj7L6wNacoLeSl69A3Px-P5g1=s96-c	2025-10-24 10:44:36.832	2025-10-24 10:44:36.832	0	user
DKRL5rZgbDkKoUiVuhOb1sJ8Id6T7GmD	Khun Naing Tun	khunnaingtun123456@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocJdGRXgOWSDKLt0pXIeSV35_QGWl9zF8DfC5vKMtvHTOVGyRw=s96-c	2025-11-16 14:29:17.35	2025-11-16 14:29:17.35	0	user
l4V98TiNEXefmfEnHHreuNKlEq7ApSmr	ronnakrit cheinvichai	ronnakritnook1@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocLDQeu_k7gj-TYVfhP9kGVspf8QDJdod3rSATawhLJfmg__hA=s96-c	2025-10-20 11:48:38.467	2025-10-20 11:48:38.467	0	user
uCdfKV1l5UvnFmg1ePvmIXjk8fSFaqCd	expert8solution	expert8solution@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocKFMv_phWGZrbTR-mTYEWxSL4Z2pxa7Q1idYnd8gHnMrdV3WA=s96-c	2025-10-20 19:18:08.104	2025-10-20 19:18:08.104	0	user
DXt4LVJradCTh8GHX3ZS2Nz80wxpGmbF	napate	napate@gmail.com	f	\N	2025-10-24 16:14:28.125	2025-10-24 16:14:28.125	0	user
ucdAcyFpkzr9fuTjhd0wjygtaHdnF7M0	Nooknatt	ronnakrit168@gmail.com	f	\N	2025-10-24 16:32:39.583	2025-10-24 16:32:39.583	0	user
cXDYy0ikduydWOeiSmLB6SV2HIIFMqes	chalong	chalong@gmail.com	f	\N	2025-10-25 09:00:55.714	2025-10-25 09:00:55.714	7	user
OHRGiRcDszNfSBeSISwv0IeWByHqExJo	ikนวลจันทร์ chnnelโจันทร์	mmooss3500@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocLHVtKjrbbSr5Fba7i3nZfxh20LYbegLOGOmx7W7iKd4aas22zB=s96-c	2025-11-23 00:48:50.908	2025-11-23 00:48:50.908	0	user
oic8XzwBrCjjWUNTEB3A82DfxFOeHoTQ	xflop	zasxcvdev@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocIUGG8liQ2GrtMPnWF0rE6qfb_waCgVZF3IrPlF8tCNV6FKWw=s96-c	2025-11-17 09:17:42.851	2025-11-17 09:17:42.851	459.71	user
KFnvOzIRi0AHl81vcQO2vD0jy93kzBP5	capsoul	capsoulshopz@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocLKXOrgoi5YHLLDgtDfUyrlFWE1vWNgHefPKxrlY66leOF4NQ=s96-c	2025-10-06 11:06:41.224	2025-10-06 11:06:41.224	0	admin
bmuURX7ZswSETG3oV3Eczu7Dv9XOcSTt	Tt Ty	tytt46537@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocIMqwDmxyL-ujkMcHKp0kjyE4eUO3hD1ABQCm6q8NQFB97mFQ=s96-c	2025-10-29 13:54:13.145	2025-10-29 13:54:13.145	0	user
OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	พิชญดา พันทา	pichayada040641@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocLHwXt-Gvu3K782wMneZQ8nc6v3_aMBqSpU-cFN6gxpFySWvw=s96-c	2025-10-24 14:49:50.314	2025-10-24 14:49:50.314	115	user
M99B7kK5B66VgDKlphbFtYQqZMczZAKd	chanikrian chienvichai	chanikrianchienvichai@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocK-aiN_NRys0_6izHiEzvt42ub8fy3HzZMYvZOIXXrVNY7D=s96-c	2025-11-23 12:10:43.927	2025-11-23 12:10:43.927	0	admin
8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	ronnakrit cheinvichai	ronnakritcheinvichai@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocIPR9ktDMBFclBLeXWkJxmLld1z6qOf8U_IMi8BHHE4MykHIzN9=s96-c	2025-10-06 11:07:35.375	2025-10-06 11:07:35.375	10082.42	admin
l5i3W5iRJBwGO002ceSUGQJBWoFEsBwY	เป็นหูหนวก ชอบเกมส์เล่นเลย	qqsmoon@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocIB4qsdOUApgTCmIbg-IsXgPgWtiqWk5kv3jWh3Ugb0Qw3t47D5=s96-c	2025-11-05 08:08:35.168	2025-11-05 08:08:35.168	0	user
o1JiI5J8Qqs2TGyPVYlcra86zuYTzawp	THE KID DAMN	thekidsdamn@gmail.com	t	https://lh3.googleusercontent.com/a/ACg8ocJo3Itg_hKr3AXZjf6Ohn3GUjn_TwPXASBSoB-W3HvM-DoKuRf4=s96-c	2025-11-06 11:06:52.569	2025-11-06 11:06:52.569	10	user
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
SyKDX0ssCfjewQzHkyJtrb7fY10IYpYT	1h01pO16AFN_J9neW5itjg6hmGCc06tJ	{"callbackURL":"/dashboard?login=success","codeVerifier":"4rCJT4XTiF1cbSy--LyRMaeVv35jaYX3NsFcF3w11HQZ0uPXY2CoWaJZvyYGJ6oTg9runpIsUPbRmAPYY-1Erp_YJDe3W59oOGvzlwO3ZOBwREyLNhH3BCJbTKlTMD5P","expiresAt":1763901060242}	2025-11-23 12:31:00.242	2025-11-23 12:21:00.242	2025-11-23 12:21:00.242
\.


--
-- Data for Name: verified_slip; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.verified_slip (id, "payloadHash", "transRef", amount, "userId", "verifiedAt") FROM stdin;
cmgizhakj0000iytsrnn0r4al	40a1a05e767323ef925f123e30bd5c263aaf4c67837979579c376b0975eea6fc	Aab669b3fc830473d	2	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-09 05:35:12.067
cmgizmaxy0000iy1ar319m18u	bc234347636df6c1e5b58b62c756f193b6db4f5feb6056699b764772acb9b1ff	A8e1f34be8ff94ff6	3	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-09 05:39:05.829
cmgxom8zb0000iyxglnepemnc	7c99895036b260cf4413c423f4093ae444724618ca1ba18af4744efeee05ec63	Ae3b939c164024a8a	10	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-19 12:27:40.15
cmh27odul0000l504dpgstcca	45160362155f34fc1f83352cd6e06a1da30cfda9829f4863e24bda84c73f057f	Ad126245c8fb548cf	60	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-22 16:32:17.182
cmh28sfge0000l105nbzj4dyq	f69736c844617122ac5d186911ea2fb01f5f4464558bff3aac85662b90590193	Ae3099f2fe54a4104	30	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-22 17:03:25.502
cmh2922r90000iyw9edfgne9p	79fa24a7b58e9338995a4b4e81522efaad67045bfedd29255d51868ac4162838	Ab4c69125eb714b01	39	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-22 17:10:55.606
cmh29f4wo0000l504ncp9o2ft	86af162362c9932b8a21b8ac204d67538009bfcabf23e3d7d9f91419d60adad8	Ac2106208ac5e4c7d	30	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-22 17:21:04.92
cmh29jrzt0001l804ggivhxok	d45c5c58afa8cc03d902a9d13bfefde6f0f251f99593afb37d300f0f722ca8cd	Aa16d0bbe270e4157	50	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-22 17:24:41.466
cmh29s8cz0000jm04vod2ftoa	92727c5c14ec211b0274fcb80237337137071b60ebcb3347cb31e727bf4b0f52	A7b992752686c4e63	30	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-22 17:31:15.923
cmh4no0wu0000jp041s8repte	b65f99356d3d93af0649e25dbe5ac61d52ef3d2ec91f4b2be024e133ddfd88cb	015297163440CTF03330	5	DkC6JUXnfpmTddUNpPsgp1fPALT5GaWW	2025-10-24 09:35:26.622
cmh6299na0000iyp8mvzwr51m	5600db094962261a17b352ce055bad62912b6ee2522f67b39ead2907a3ab0101	A352fff48991c42f4	7	cXDYy0ikduydWOeiSmLB6SV2HIIFMqes	2025-10-25 09:11:38.519
cmh7vfssg0000ld043eqb06x7	130f36da7237d0be322dc94067744066f2792929f92bb2f3598b6d5693feddc1	Ab19bdc6cf0b5417c	38	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-10-26 15:36:18.304
cmh933vkz0001ic04nk0z5iqa	0117559fde44253f3127eab3d8d66137ed5c4d229aa8bcc78e50873e87cc460a	2025102757HPYtJJxakgjSUQq	10	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	2025-10-27 11:58:45.155
cmhi1x02l0001ju04om6hwqvv	2994c22fc72cfdc048e4a6b7639f3569fe30813569a3248bbccd1d9a43046a3f	202511033sNTOHIcod8eCZ3j3	50	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	2025-11-02 18:35:20.35
cmhnbtraf0001jv045l529sdu	56f09c50bb5d9024535e3f89d2414f3c63adb3835662bf952d11efbfc09db207	015310181104BTF03141	10	o1JiI5J8Qqs2TGyPVYlcra86zuYTzawp	2025-11-06 11:11:36.039
cmhqevkps0001jr04mac9ft3h	70166e70cf149608a6be3f0eb7363e3ace4717a3b0fc4b71b593910300123c05	A6683a1b11fc3416f	25	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-11-08 15:00:18.209
cmhxgpj8w0001jj04t02mhehb	6d6e0928752704b71e8857b0f9d81b36bad08c718c951efb4fc57d5a08d00b59	202511136sqG7gHCjotk0tzPh	90	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	2025-11-13 13:25:58.833
cmi5x8q3n0001jo04ifxy8zse	4dd170ed280ae1d0bd1f7f57f9693e70ca010d46b966f8271c404d7dd0e2fb1e	202511194r0pXht4wqIGNW8xN	20	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	2025-11-19 11:30:57.443
cmi5xmktx0001ju040mvn1t2r	d6318b23b552ff3c683781cc235c76eb42ce3490510a203c8ed4ddc43a435459	532318331594I000012B9790	50	OdLhumV8Dj7lyPo9lXFDDd7TcAe9P8X1	2025-11-19 11:41:43.797
cmibp6fzq0001l204o8kmh8is	3a1b6cc03db2eb7e54aaf93ee887aeb336477dea35221378b4e561d4e8680fa8	A9baeaf9adc8e4b9e	10000	8b1QbvyXFdviGxNiokn43Co0ByK72Iy5	2025-11-23 12:31:51.159
\.


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: article article_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (id);


--
-- Name: card_option card_option_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.card_option
    ADD CONSTRAINT card_option_pkey PRIMARY KEY (id);


--
-- Name: card card_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);


--
-- Name: featured_product featured_product_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.featured_product
    ADD CONSTRAINT featured_product_pkey PRIMARY KEY (id);


--
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- Name: mix_package mix_package_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_package
    ADD CONSTRAINT mix_package_pkey PRIMARY KEY (id);


--
-- Name: package package_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.package
    ADD CONSTRAINT package_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_price product_price_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_price
    ADD CONSTRAINT product_price_pkey PRIMARY KEY (id);


--
-- Name: purchase_card purchase_card_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_card
    ADD CONSTRAINT purchase_card_pkey PRIMARY KEY (id);


--
-- Name: purchase_game purchase_game_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_game
    ADD CONSTRAINT purchase_game_pkey PRIMARY KEY (id);


--
-- Name: purchase_history purchase_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_history
    ADD CONSTRAINT purchase_history_pkey PRIMARY KEY (id);


--
-- Name: redeem_history redeem_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redeem_history
    ADD CONSTRAINT redeem_history_pkey PRIMARY KEY (id);


--
-- Name: server server_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.server
    ADD CONSTRAINT server_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: verified_slip verified_slip_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.verified_slip
    ADD CONSTRAINT verified_slip_pkey PRIMARY KEY (id);


--
-- Name: article_published_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX article_published_idx ON public.article USING btree (published);


--
-- Name: article_slug_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX article_slug_idx ON public.article USING btree (slug);


--
-- Name: article_slug_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX article_slug_key ON public.article USING btree (slug);


--
-- Name: featured_product_productId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "featured_product_productId_key" ON public.featured_product USING btree ("productId");


--
-- Name: product_price_productId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "product_price_productId_key" ON public.product_price USING btree ("productId");


--
-- Name: purchase_history_reference_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX purchase_history_reference_key ON public.purchase_history USING btree (reference);


--
-- Name: redeem_history_payloadHash_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "redeem_history_payloadHash_idx" ON public.redeem_history USING btree ("payloadHash");


--
-- Name: redeem_history_payloadHash_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "redeem_history_payloadHash_key" ON public.redeem_history USING btree ("payloadHash");


--
-- Name: redeem_history_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "redeem_history_userId_idx" ON public.redeem_history USING btree ("userId");


--
-- Name: session_token_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: verified_slip_payloadHash_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "verified_slip_payloadHash_idx" ON public.verified_slip USING btree ("payloadHash");


--
-- Name: verified_slip_payloadHash_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "verified_slip_payloadHash_key" ON public.verified_slip USING btree ("payloadHash");


--
-- Name: verified_slip_transRef_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "verified_slip_transRef_idx" ON public.verified_slip USING btree ("transRef");


--
-- Name: verified_slip_transRef_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "verified_slip_transRef_key" ON public.verified_slip USING btree ("transRef");


--
-- Name: verified_slip_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "verified_slip_userId_idx" ON public.verified_slip USING btree ("userId");


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: card_option card_option_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.card_option
    ADD CONSTRAINT "card_option_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public.card(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mix_package mix_package_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_package
    ADD CONSTRAINT "mix_package_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public.game(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: package package_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.package
    ADD CONSTRAINT "package_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public.game(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_card purchase_card_cardOptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_card
    ADD CONSTRAINT "purchase_card_cardOptionId_fkey" FOREIGN KEY ("cardOptionId") REFERENCES public.card_option(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_card purchase_card_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_card
    ADD CONSTRAINT "purchase_card_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_game purchase_game_mixPackageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_game
    ADD CONSTRAINT "purchase_game_mixPackageId_fkey" FOREIGN KEY ("mixPackageId") REFERENCES public.mix_package(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_game purchase_game_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_game
    ADD CONSTRAINT "purchase_game_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.package(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_game purchase_game_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_game
    ADD CONSTRAINT "purchase_game_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public.server(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_game purchase_game_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_game
    ADD CONSTRAINT "purchase_game_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: redeem_history redeem_history_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redeem_history
    ADD CONSTRAINT "redeem_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: server server_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.server
    ADD CONSTRAINT "server_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public.game(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: verified_slip verified_slip_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.verified_slip
    ADD CONSTRAINT "verified_slip_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict a0kZyZ7GTv9FhijDP66I5CgNgx3eWNr0zxhtBqJdfuWGBZlQRzKfpsgkdL1BPbh

