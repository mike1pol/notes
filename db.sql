-- phpMyAdmin SQL Dump
-- version 2.11.9.4
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 19 2009 г., 17:28
-- Версия сервера: 5.0.18
-- Версия PHP: 5.1.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- База данных: `sas-group`
--

-- --------------------------------------------------------

--
-- Структура таблицы `notes`
--

CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(10) NOT NULL auto_increment,
  `user_id` int(10) NOT NULL,
  `text` text collate utf8_bin NOT NULL,
  `x` int(10) NOT NULL,
  `y` int(10) NOT NULL,
  `color` int(1) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=11 ;

--
-- Дамп данных таблицы `notes`
--

