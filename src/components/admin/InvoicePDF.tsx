import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register Roboto font for better Unicode support (Rupee symbol)
Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Roboto",
        color: "#1a1a2e",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
        borderBottom: 2,
        borderBottomColor: "#c5a059",
        paddingBottom: 20,
    },
    businessInfo: {
        flexDirection: "column",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1a1a2e",
    },
    subtitle: {
        color: "#c5a059",
        fontSize: 12,
        marginTop: 4,
    },
    address: {
        marginTop: 10,
        fontSize: 9,
        color: "#666",
        lineHeight: 1.4,
    },
    invoiceDetails: {
        textAlign: "right",
    },
    invoiceTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    customerSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    customerBox: {
        width: "45%",
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#c5a059",
        textTransform: "uppercase",
        marginBottom: 8,
        borderBottom: 1,
        borderBottomColor: "#eee",
        paddingBottom: 4,
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8f9fa",
        padding: 8,
        fontWeight: "bold",
        borderBottom: 1,
        borderBottomColor: "#eee",
    },
    tableRow: {
        flexDirection: "row",
        padding: 8,
        borderBottom: 1,
        borderBottomColor: "#eee",
    },
    colDesc: { width: "60%" },
    colQty: { width: "10%", textAlign: "center" },
    colPrice: { width: "15%", textAlign: "right" },
    colTotal: { width: "15%", textAlign: "right" },
    summarySection: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    summaryBox: {
        width: "35%",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    summaryLabel: {
        color: "#666",
    },
    summaryValue: {
        fontWeight: "bold",
    },
    grandTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        paddingTop: 8,
        borderTop: 2,
        borderTopColor: "#1a1a2e",
    },
    totalText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1a1a2e",
    },
    footer: {
        position: "absolute",
        bottom: 40,
        left: 40,
        right: 40,
        textAlign: "center",
        color: "#999",
        fontSize: 8,
        borderTop: 1,
        borderTopColor: "#eee",
        paddingTop: 10,
    },
    statusBadge: {
        marginTop: 10,
        padding: "4 8",
        borderRadius: 4,
        fontSize: 9,
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "flex-end",
    },
    paid: { backgroundColor: "#e6f4ea", color: "#1e7e34" },
    unpaid: { backgroundColor: "#fce8e6", color: "#d93025" },
    partial: { backgroundColor: "#e8f0fe", color: "#1967d2" },
});

export const InvoicePDF = ({ invoice }: { invoice: any }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.businessInfo}>
                        <Text style={styles.title}>Tanwar Tailor</Text>
                        <Text style={styles.subtitle}>Premium Bespoke Tailoring</Text>
                        <View style={styles.address}>
                            <Text>Near Tehsil, Behind Sana Fashion & Pakija Collection</Text>
                            <Text>Mochivada Road, Sikar, Rajasthan - 332001</Text>
                            <Text>Phone: +91-876-997-2001</Text>
                            <Text>Phone: +91-935-165-0955</Text>
                            <Text>Email: tailortanwar@gmail.com</Text>
                        </View>
                    </View>
                    <View style={styles.invoiceDetails}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text>No: {invoice.invoiceNumber}</Text>
                        <Text>Date: {format(new Date(), "dd/MM/yyyy")}</Text>
                        <Text>Due: {format(new Date(invoice.dueDate), "dd/MM/yyyy")}</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                styles[invoice.status.toLowerCase() as keyof typeof styles] as any,
                            ]}
                        >
                            <Text>{invoice.status.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* Customer Section */}
                <View style={styles.customerSection}>
                    <View style={styles.customerBox}>
                        <Text style={styles.sectionTitle}>Bill To</Text>
                        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4 }}>
                            {invoice.customerName}
                        </Text>
                        <Text>{invoice.customerPhone}</Text>
                        {invoice.customerEmail && <Text>{invoice.customerEmail}</Text>}
                        {invoice.customerAddress && (
                            <Text style={{ marginTop: 4 }}>{invoice.customerAddress}</Text>
                        )}
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colDesc}>Description</Text>
                        <Text style={styles.colQty}>Qty</Text>
                        <Text style={styles.colPrice}>Price</Text>
                        <Text style={styles.colTotal}>Total</Text>
                    </View>
                    {invoice.items.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.colDesc}>{item.description}</Text>
                            <Text style={styles.colQty}>{item.quantity}</Text>
                            <Text style={styles.colPrice}>₹ {item.price}</Text>
                            <Text style={styles.colTotal}>₹ {item.total}</Text>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>₹ {invoice.subtotal}</Text>
                        </View>
                        {invoice.tax > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Tax ({invoice.tax}%)</Text>
                                <Text style={styles.summaryValue}>
                                    ₹{((invoice.subtotal * invoice.tax) / 100).toFixed(2)}
                                </Text>
                            </View>
                        )}
                        {invoice.discount > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Discount ({invoice.discount}%)</Text>
                                <Text style={styles.summaryValue}>
                                    -₹ {((invoice.subtotal * invoice.discount) / 100).toFixed(2)}
                                </Text>
                            </View>
                        )}
                        <View style={styles.grandTotal}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalText}>₹ {invoice.grandTotal}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Thank you for choosing Tanwar Tailor!</Text>
                    <Text style={{ marginTop: 2 }}>
                        This is a computer-generated invoice and does not require a signature.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
