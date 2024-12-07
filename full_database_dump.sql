--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2

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
-- Name: airline_airlineid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.airline_airlineid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.airline_airlineid_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: airline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.airline (
    airlineid integer DEFAULT nextval('public.airline_airlineid_seq'::regclass) NOT NULL,
    airlinename character varying(100),
    airlinecode character varying(10) NOT NULL,
    country character varying(50),
    contactinfo character varying(255)
);


ALTER TABLE public.airline OWNER TO postgres;

--
-- Name: airport_airportid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.airport_airportid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.airport_airportid_seq OWNER TO postgres;

--
-- Name: airport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.airport (
    airportid integer DEFAULT nextval('public.airport_airportid_seq'::regclass) NOT NULL,
    airportcode character varying(10) NOT NULL,
    airportname character varying(100),
    city character varying(50),
    country character varying(50)
);


ALTER TABLE public.airport OWNER TO postgres;

--
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
    bookingid integer NOT NULL,
    userid integer NOT NULL,
    flightid integer NOT NULL,
    bookingdate date,
    bookingstatus character varying(20) DEFAULT 'Pending'::character varying,
    numberofpassengers integer,
    CONSTRAINT booking_bookingstatus_check CHECK (((bookingstatus)::text = ANY ((ARRAY['Confirmed'::character varying, 'Cancelled'::character varying, 'Pending'::character varying])::text[])))
);


ALTER TABLE public.booking OWNER TO postgres;

--
-- Name: booking_bookingid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_bookingid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_bookingid_seq OWNER TO postgres;

--
-- Name: booking_bookingid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_bookingid_seq OWNED BY public.booking.bookingid;


--
-- Name: flight_flightid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flight_flightid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flight_flightid_seq OWNER TO postgres;

--
-- Name: flight; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flight (
    flightid integer DEFAULT nextval('public.flight_flightid_seq'::regclass) NOT NULL,
    flightnumber character varying(20) NOT NULL,
    departuredatetime timestamp without time zone,
    arrivaldatetime timestamp without time zone,
    duration integer,
    departureairport integer NOT NULL,
    arrivalairport integer NOT NULL,
    airlineid integer NOT NULL,
    aircrafttype character varying(50),
    availableseats integer,
    price numeric(10,2)
);


ALTER TABLE public.flight OWNER TO postgres;

--
-- Name: itinerary_itineraryid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.itinerary_itineraryid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itinerary_itineraryid_seq OWNER TO postgres;

--
-- Name: itinerary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itinerary (
    itineraryid integer DEFAULT nextval('public.itinerary_itineraryid_seq'::regclass) NOT NULL,
    bookingid integer NOT NULL,
    flightid integer NOT NULL,
    departuredatetime timestamp without time zone,
    arrivaldatetime timestamp without time zone,
    seatnumber character varying(20),
    gatenumber character varying(20),
    baggageinfo character varying(255)
);


ALTER TABLE public.itinerary OWNER TO postgres;

--
-- Name: passenger_passengerid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.passenger_passengerid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.passenger_passengerid_seq OWNER TO postgres;

--
-- Name: passenger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.passenger (
    passengerid integer DEFAULT nextval('public.passenger_passengerid_seq'::regclass) NOT NULL,
    bookingid integer NOT NULL,
    firstname character varying(50),
    lastname character varying(50),
    passportnumber character varying(20),
    dateofbirth date,
    nationality character varying(50),
    gender character(1)
);


ALTER TABLE public.passenger OWNER TO postgres;

--
-- Name: payment_paymentid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_paymentid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_paymentid_seq OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    paymentid integer DEFAULT nextval('public.payment_paymentid_seq'::regclass) NOT NULL,
    bookingid integer NOT NULL,
    userid integer NOT NULL,
    paymentamount numeric(10,2),
    paymentdate date,
    paymentmethod character varying(50),
    paymentstatus character varying(20) DEFAULT 'Pending'::character varying,
    CONSTRAINT payment_paymentstatus_check CHECK (((paymentstatus)::text = ANY ((ARRAY['Completed'::character varying, 'Failed'::character varying, 'Pending'::character varying])::text[])))
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_userid_seq OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer DEFAULT nextval('public.users_userid_seq'::regclass) NOT NULL,
    firstname character varying(50),
    lastname character varying(50),
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phonenumber character varying(20),
    address character varying(255),
    usertype character varying(20),
    dateofbirth date,
    CONSTRAINT users_usertype_check CHECK (((usertype)::text = ANY ((ARRAY['Regular User'::character varying, 'Admin'::character varying, 'Airline Staff'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: booking bookingid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking ALTER COLUMN bookingid SET DEFAULT nextval('public.booking_bookingid_seq'::regclass);


--
-- Data for Name: airline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.airline (airlineid, airlinename, airlinecode, country, contactinfo) FROM stdin;
1	American Airlines	AA	USA	contact@aa.com
2	Delta Airlines	DL	USA	contact@delta.com
3	British Airways	BA	UK	contact@ba.com
4	Air India	AI	India	contact@airindia.com
5	United Airlines	UA	USA	contact@united.com
\.


--
-- Data for Name: airport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.airport (airportid, airportcode, airportname, city, country) FROM stdin;
1	PHX	Sky Harbor International	Phoenix	USA
2	LAX	Los Angeles International	Los Angeles	USA
3	JFK	John F. Kennedy International	New York	USA
4	LHR	Heathrow Airport	London	UK
5	DEL	Indira Gandhi International	Delhi	India
\.


--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking (bookingid, userid, flightid, bookingdate, bookingstatus, numberofpassengers) FROM stdin;
1	2	1	2024-12-05	Confirmed	1
2	1	1	2024-12-06	Confirmed	1
4	2	2	2024-12-06	Confirmed	1
5	4	2	2024-12-06	Confirmed	1
6	6	2	2024-12-06	Confirmed	1
7	7	2	2024-12-06	Confirmed	1
8	8	2	2024-12-06	Confirmed	1
9	16	3	2023-11-03	Cancelled	3
10	17	4	2023-11-04	Confirmed	4
11	18	5	2023-11-05	Pending	2
\.


--
-- Data for Name: flight; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flight (flightid, flightnumber, departuredatetime, arrivaldatetime, duration, departureairport, arrivalairport, airlineid, aircrafttype, availableseats, price) FROM stdin;
3	BA789	2024-12-12 17:00:00	2025-12-12 23:00:00	360	3	4	3	Boeing 747	300	600.00
4	AI101	2024-12-13 06:00:00	2025-12-13 10:00:00	240	4	5	4	Airbus A330	220	450.00
5	UA202	2024-12-14 14:00:00	2025-12-14 18:00:00	240	5	1	5	Boeing 777	250	500.00
1	AA123	2024-12-10 08:00:00	2025-12-10 12:00:00	240	1	2	1	Boeing 737	178	350.00
2	DL456	2024-12-11 09:30:00	2025-12-11 13:30:00	240	2	3	2	Airbus A320	195	400.00
\.


--
-- Data for Name: itinerary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itinerary (itineraryid, bookingid, flightid, departuredatetime, arrivaldatetime, seatnumber, gatenumber, baggageinfo) FROM stdin;
2	2	1	2024-12-10 08:00:00	2024-12-10 12:00:00	14B	G2	1 Checked Bag
3	1	1	2024-12-10 08:00:00	2024-12-10 12:00:00	12C	G5	1 Checked Bag
5	4	2	2024-12-11 09:30:00	2025-12-11 13:30:00	Auto-assigned	TBD	Standard baggage allowance
6	5	2	2024-12-11 09:30:00	2025-12-11 13:30:00	Auto-assigned	TBD	Standard baggage allowance
7	6	2	2024-12-11 09:30:00	2025-12-11 13:30:00	Auto-assigned	TBD	Standard baggage allowance
8	7	2	2024-12-11 09:30:00	2025-12-11 13:30:00	Auto-assigned	TBD	Standard baggage allowance
9	8	2	2024-12-11 09:30:00	2025-12-11 13:30:00	Auto-assigned	TBD	Standard baggage allowance
10	10	5	2023-11-05 06:30:00	2023-11-05 09:30:00	17E	G5	2 Checked Bags
\.


--
-- Data for Name: passenger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.passenger (passengerid, bookingid, firstname, lastname, passportnumber, dateofbirth, nationality, gender) FROM stdin;
12	6	Alice	Brown	P1234567	1985-05-14	American	F
13	6	John	Brown	P2345678	1987-07-20	American	M
14	7	Bob	Smith	P3456789	1990-08-22	American	M
15	8	Carol	Davis	P4567890	1992-11-12	American	F
16	8	Dan	Davis	P5678901	1995-04-18	American	M
17	9	Dan	Williams	P6789012	1988-12-05	American	M
18	9	Eva	Williams	P7890123	1990-05-15	American	F
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (paymentid, bookingid, userid, paymentamount, paymentdate, paymentmethod, paymentstatus) FROM stdin;
6	4	9	500.00	2023-09-18	Credit Card	Completed
7	5	10	300.00	2023-09-19	Debit Card	Failed
4	4	9	500.00	2023-09-18	Credit Card	Completed
5	5	10	300.00	2023-09-19	Debit Card	Failed
8	6	14	800.00	2023-11-01	Credit Card	Completed
9	7	15	450.00	2023-11-02	PayPal	Pending
10	8	16	1200.00	2023-11-03	Debit Card	Failed
11	9	17	1600.00	2023-11-04	Credit Card	Completed
12	10	18	950.00	2023-11-05	PayPal	Pending
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, firstname, lastname, email, password, phonenumber, address, usertype, dateofbirth) FROM stdin;
1	John	Doe	john.doe@example.com	securepassword	\N	\N	\N	\N
2	Abdullah	NolastName	nolastbakra@asu.edu	masood@90	\N	\N	\N	\N
4	smitrajsinh	sarvaiya	abc@gmail.com	smit64	\N	\N	\N	\N
5	john	smith	test@gmail.com	smit64	\N	\N	\N	\N
6	test	test	1234@gmail.com	1234	\N	\N	\N	\N
7	test	test	12345@gmail.com	1234	\N	\N	\N	\N
8	Ridham	Shah	xyz@gmail.com	12345	\N	\N	\N	\N
9	Eve	Wilson	eve.wilson@example.com	hashed_password_9	111-222-3333	159 Walnut Way	Regular User	1983-02-18
10	Frank	Anderson	frank.anderson@example.com	hashed_password_10	777-888-9999	753 Cherry Court	Regular User	1995-09-25
11	Grace	Thomas	grace.thomas@example.com	hashed_password_11	666-777-8888	852 Willow Drive	Regular User	1987-06-14
12	Henry	Moore	henry.moore@example.com	hashed_password_12	555-666-7777	951 Poplar Place	Regular User	1991-01-05
13	Isabel	Taylor	isabel.taylor@example.com	hashed_password_13	444-555-6666	369 Elm Street	Regular User	1984-04-23
14	Alice	Brown	alice.brown@example.com	hashed_password_14	111-222-3333	123 Elm Street	Regular User	1985-05-14
15	Bob	Smith	bob.smith@example.com	hashed_password_15	222-333-4444	456 Oak Avenue	Admin	1990-08-22
16	Carol	Davis	carol.davis@example.com	hashed_password_16	333-444-5555	789 Pine Road	Regular User	1992-11-12
17	Dan	Williams	dan.williams@example.com	hashed_password_17	444-555-6666	951 Poplar Place	Regular User	1988-12-05
18	Eva	Taylor	eva.taylor@example.com	hashed_password_18	555-666-7777	321 Cedar Lane	Airline Staff	1995-07-20
19	Frank	Moore	frank.moore@example.com	hashed_password_19	666-777-8888	753 Birch Boulevard	Regular User	1980-07-07
20	Grace	Wilson	grace.wilson@example.com	hashed_password_20	777-888-9999	369 Walnut Way	Regular User	1994-03-30
21	Henry	Anderson	henry.anderson@example.com	hashed_password_21	888-999-0000	159 Cherry Court	Regular User	1991-06-15
22	Ivy	Johnson	ivy.johnson@example.com	hashed_password_22	999-000-1111	258 Spruce Street	Admin	1987-04-25
23	Jack	Lee	jack.lee@example.com	hashed_password_23	000-111-2222	147 Ash Alley	Airline Staff	1993-09-10
\.


--
-- Name: airline_airlineid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.airline_airlineid_seq', 6, true);


--
-- Name: airport_airportid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.airport_airportid_seq', 6, true);


--
-- Name: booking_bookingid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.booking_bookingid_seq', 11, true);


--
-- Name: flight_flightid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flight_flightid_seq', 6, true);


--
-- Name: itinerary_itineraryid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.itinerary_itineraryid_seq', 10, true);


--
-- Name: passenger_passengerid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.passenger_passengerid_seq', 18, true);


--
-- Name: payment_paymentid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_paymentid_seq', 12, true);


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_userid_seq', 23, true);


--
-- Name: airline airline_airlinecode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.airline
    ADD CONSTRAINT airline_airlinecode_key UNIQUE (airlinecode);


--
-- Name: airline airline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.airline
    ADD CONSTRAINT airline_pkey PRIMARY KEY (airlineid);


--
-- Name: airport airport_airportcode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.airport
    ADD CONSTRAINT airport_airportcode_key UNIQUE (airportcode);


--
-- Name: airport airport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.airport
    ADD CONSTRAINT airport_pkey PRIMARY KEY (airportid);


--
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (bookingid);


--
-- Name: flight flight_flightnumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_flightnumber_key UNIQUE (flightnumber);


--
-- Name: flight flight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_pkey PRIMARY KEY (flightid);


--
-- Name: itinerary itinerary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_pkey PRIMARY KEY (itineraryid);


--
-- Name: passenger passenger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passenger
    ADD CONSTRAINT passenger_pkey PRIMARY KEY (passengerid);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (paymentid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: booking booking_flightid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_flightid_fkey FOREIGN KEY (flightid) REFERENCES public.flight(flightid);


--
-- Name: booking booking_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: flight flight_airlineid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_airlineid_fkey FOREIGN KEY (airlineid) REFERENCES public.airline(airlineid);


--
-- Name: flight flight_arrivalairport_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_arrivalairport_fkey FOREIGN KEY (arrivalairport) REFERENCES public.airport(airportid);


--
-- Name: flight flight_departureairport_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_departureairport_fkey FOREIGN KEY (departureairport) REFERENCES public.airport(airportid);


--
-- Name: itinerary itinerary_bookingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_bookingid_fkey FOREIGN KEY (bookingid) REFERENCES public.booking(bookingid);


--
-- Name: itinerary itinerary_flightid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_flightid_fkey FOREIGN KEY (flightid) REFERENCES public.flight(flightid);


--
-- Name: passenger passenger_bookingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passenger
    ADD CONSTRAINT passenger_bookingid_fkey FOREIGN KEY (bookingid) REFERENCES public.booking(bookingid);


--
-- Name: payment payment_bookingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_bookingid_fkey FOREIGN KEY (bookingid) REFERENCES public.booking(bookingid);


--
-- Name: payment payment_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--

