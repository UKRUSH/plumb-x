'use client';
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 24
  },
  tableHeader: {
    backgroundColor: '#f3f4f6'
  },
  tableCell: {
    width: '16.66%',
    padding: 5
  }
});

export const InventoryPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Inventory Report</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Item Code</Text>
          <Text style={styles.tableCell}>Name</Text>
          <Text style={styles.tableCell}>Category</Text>
          <Text style={styles.tableCell}>Stock Level</Text>
          <Text style={styles.tableCell}>Value</Text>
          <Text style={styles.tableCell}>Last Updated</Text>
        </View>
        {data.map((item) => (
          <View key={item.itemCode} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.itemCode}</Text>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.category}</Text>
            <Text style={styles.tableCell}>{item.stockLevel}</Text>
            <Text style={styles.tableCell}>${item.value}</Text>
            <Text style={styles.tableCell}>{item.lastUpdated}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
