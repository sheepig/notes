var fs = require('fs');
fs.readFile('./world.dbf', function(err, buf) {
    // console.log(Buffer.isBuffer(buf));
    var header = {};
    var date = new Date();
    date.setUTCFullYear(1900 + buf[1]);
    date.setUTCMonth(buf[2]);
    date.setUTCDate(buf[3]);
    header.lastUpdate = date.toUTCString();
    header.totalRecords = buf.readUInt32LE(4);
    header.bytesINHeader = buf.readUInt16LE(8);
    header.bytesPerRecords = buf.readUInt16LE(10);
    console.log(header);
    
    var fields = [];
    var fieldOffset = 32;
    var fieldTerminator = 0x0D;

    while(buf[fieldOffset] != fieldTerminator) {
        var FIELD_TYPES = {
            C: 'Character',
            N: 'Numeric'
        };
        var field = {};
        var fieldBuf = buf.slice(fieldOffset, fieldOffset + 32);
        field.name = fieldBuf.toString('ascii', 0, 11).replace(/\u0000/g, '');
        field.type = FIELD_TYPES[fieldBuf.toString('ascii', 11, 12)];
        field.length = fieldBuf[16];
        fields.push(field)
        fieldOffset += 32;   
    }
    var startingRecordOffset = header.bytesINHeader;
    var records = [];
    for (let i = 0; i < header.totalRecords; i++) {
        var recordOffset = startingRecordOffset + (i + header.bytesPerRecords);
        var record = {};
        record._isDel = buf.readUInt8(recordOffset) == 0x2A;
        recordOffset++;
        for (let j = 0; j < fields.length; j++) {
            field = fields[j];
            var Type = field.type === 'Numeric' ? Number : String;
            record[field.name] = Type(buf.toString('utf8', recordOffset, recordOffset + field.length).trim());
            recordOffset += field.length;
        }
        records.push(record);
    }
    console.log(records);
    
    
});

module.exports = {};