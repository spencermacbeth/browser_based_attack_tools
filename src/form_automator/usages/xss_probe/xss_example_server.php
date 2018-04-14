<?php

function generateSalesPage() {
    $sellingPrice = $_POST['selling_price'];
    $sanitizedSellingPrice = str_replace(['<script>', '</script>'], '', $sellingPrice);
    if ($sellingPrice !== $sanitizedSellingPrice) return '<html><body>Nice try.</body></html>';
    return "<html><body>Selling price: $sanitizedSellingPrice</body></html>";
}

echo generateSalesPage();