function LayoutHeader(title, css) {
    return `<!DOCTYPE html>
<html lang="ru" >
    <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="${css}" rel="stylesheet" />
    </head>
    <body>
`;
}

module.exports = LayoutHeader;