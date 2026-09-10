<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!empty($_POST['bot-field'] ?? '')) {
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$to = 'bovart.1979@gmail.com';
$from = 'no-reply@lonburg-auto.ru';
$subjectText = trim((string)($_POST['subject'] ?? 'Новая заявка с сайта Лонбург'));
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$labels = [
    'vehicleType' => 'Тип заявки',
    'model' => 'Марка / модель',
    'condition' => 'Состояние',
    'year' => 'Год выпуска',
    'power' => 'Мощность',
    'engineVolume' => 'Объём двигателя',
    'city' => 'Город доставки',
    'name' => 'Имя',
    'contact' => 'Телефон / Telegram',
    'registration' => 'Таможня и утильсбор',
    'comment' => 'Комментарий',
];

$required = ['model', 'city', 'contact'];
$errors = [];
foreach ($required as $field) {
    if (trim((string)($_POST[$field] ?? '')) === '') {
        $errors[] = $field;
    }
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Required fields are missing'], JSON_UNESCAPED_UNICODE);
    exit;
}

$lines = ['Новая заявка с сайта Лонбург', ''];
foreach ($labels as $key => $label) {
    $value = trim((string)($_POST[$key] ?? ''));
    if ($value === '') {
        continue;
    }
    $lines[] = $label . ': ' . $value;
}

$message = implode("\n", $lines);
$replyToRaw = trim((string)($_POST['contact'] ?? ''));
$replyTo = filter_var($replyToRaw, FILTER_VALIDATE_EMAIL) ? $replyToRaw : $from;
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Лонбург <' . $from . '>',
    'Reply-To: ' . $replyTo,
];

$sent = mail($to, $subject, $message, implode("\r\n", $headers));

$telegramToken = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$telegramChatId = getenv('TELEGRAM_CHAT_ID') ?: '';
$telegramSent = null;

if ($telegramToken !== '' && $telegramChatId !== '') {
    $telegramText = '<b>Новая заявка с сайта Лонбург</b>';
    foreach ($labels as $key => $label) {
        $value = trim((string)($_POST[$key] ?? ''));
        if ($value === '') {
            continue;
        }
        $telegramText .= "\n<b>" . htmlspecialchars($label, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . ':</b> ' . htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    $telegramResponse = @file_get_contents(
        'https://api.telegram.org/bot' . rawurlencode($telegramToken) . '/sendMessage',
        false,
        stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n",
                'content' => json_encode([
                    'chat_id' => $telegramChatId,
                    'text' => $telegramText,
                    'parse_mode' => 'HTML',
                    'disable_web_page_preview' => true,
                ], JSON_UNESCAPED_UNICODE),
                'timeout' => 10,
            ],
        ])
    );
    $telegramSent = $telegramResponse !== false;
}

if (!$sent) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Mail sending failed', 'telegram' => $telegramSent], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true, 'telegram' => $telegramSent], JSON_UNESCAPED_UNICODE);
