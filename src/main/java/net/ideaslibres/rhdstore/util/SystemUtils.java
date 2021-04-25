package net.ideaslibres.rhdstore.util;

import org.springframework.data.domain.Sort;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

public class SystemUtils {
    public static String generateCode(String s) {
        return DigestUtils.md5DigestAsHex((s).getBytes(StandardCharsets.UTF_8));
    }

    public static Sort parseOrderBy(List<String> orderBy) {
        Sort sort = null;
        Sort.Direction sortDirection = null;
        for (String column : orderBy) {
            String[] options = column.split("[\\(\\)]");
            sortDirection = "asc".equals(options[0]) ? Sort.Direction.ASC : Sort.Direction.DESC;
            if (sort == null) sort = Sort.by(sortDirection, options[1]);
            else sort = sort.and(Sort.by(sortDirection, options[1]));
        }

        return sort;
    }
}
