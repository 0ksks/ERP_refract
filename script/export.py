import re

def parse_interface_document(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    pattern = r'\|\s*\*\*(.*?)\*\*\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|'
    matches = re.findall(pattern, content)

    fields = []
    for match in matches:
        field_name, example_value, data_type, _ = match
        fields.append({
            'name': field_name.strip(),
            'value': example_value.strip(),
            'type': data_type.strip()
        })

    return fields

def generate_mock_code(fields):
    code_lines = []
    code_lines.append('import Mock from "mockjs";')
    code_lines.append('')
    code_lines.append('const response = Mock.mock({')
    code_lines.append('  "data|10": [{')

    for field in fields:
        mock_type = ''
        if field['type'] == 'int':
            mock_type = f'@integer(1, 100)'  # 示例随机整数生成
        elif field['type'] == 'float':
            mock_type = f'@float(0.1, 100, 1, 2)'  # 示例随机浮点数生成
        elif field['type'] == 'string':
            mock_type = f'@word'  # 示例随机字符串生成
        elif field['type'] == 'date':
            mock_type = f'@date("yyyy/MM/dd")'  # 示例随机日期生成
        else:
            mock_type = f'"{field["value"]}"'  # 如果类型未知，使用示例值

        code_lines.append(f'    {field["name"]}: () => maybeSameField("{mock_type}"),')

    code_lines.append('    }]')
    code_lines.append('});')
    code_lines.append('')
    code_lines.append('console.log(JSON.stringify(data.items, null, 2));')

    return '\n'.join(code_lines)

def main():
    file_path = '/Users/admin/Desktop/LEARN/erp小学期/交付文件/interface/split/User.md'
    fields = parse_interface_document(file_path)
    mock_code = generate_mock_code(fields)
    print(mock_code)

if __name__ == '__main__':
    main()
