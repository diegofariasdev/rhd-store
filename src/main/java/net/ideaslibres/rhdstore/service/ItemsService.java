package net.ideaslibres.rhdstore.service;

import net.ideaslibres.rhdstore.controller.ItemsController;
import net.ideaslibres.rhdstore.exception.InvalidDataException;
import net.ideaslibres.rhdstore.exception.RecordNotFoundException;
import net.ideaslibres.rhdstore.model.dto.ItemDto;
import net.ideaslibres.rhdstore.model.repository.ItemsRepository;
import net.ideaslibres.rhdstore.util.SystemUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.aspectj.util.LangUtil.isEmpty;

@Service
public class ItemsService {

    private static final Logger logger = LoggerFactory.getLogger(ItemsService.class);

    private ItemsRepository itemsRepository;

    public ItemsService(ItemsRepository itemsRepository) {
        this.itemsRepository = itemsRepository;
    }

    public Page<ItemDto> getItems(String search, List<String> orderBy, Integer pageSize, Integer pageNumber) {
        Sort sort = SystemUtils.parseOrderBy(orderBy);

        if (!isEmpty(search)) {
            String realSearch = search.trim();
            if (!realSearch.isEmpty())
                return itemsRepository.findAllByNameLike(
                        "%" + realSearch + "%",
                        PageRequest.of(pageNumber, pageSize, sort));
        }

        Page<ItemDto> itemPage = itemsRepository
                .findAll(PageRequest.of(pageNumber, pageSize, sort));

        itemPage.forEach(item -> item.itemId = null);
        return itemPage;
    }

    public Iterable<ItemDto> saveOrUpdateItems(List<ItemDto> items) throws InvalidDataException {
        downloadPictures(items);
        calculateItemsCode(items);
        List<String> codes = items.stream().map(item -> item.code).collect(Collectors.toList());
        Iterable<ItemDto> existingItems = itemsRepository.findAllByCodeIn(codes);

        existingItems.forEach((item) -> {
            ItemDto itemFromItems = items.stream()
                    .filter((item1) -> item1.code.equals(item.code))
                    .findAny()
                    .orElse(null);

            if (itemFromItems != null) {
                itemFromItems.itemId = item.itemId;
                itemFromItems.creationTimestamp = item.creationTimestamp;
                itemFromItems.updateTimestamp = new Date();
            }
        });

        Iterable<ItemDto> savedItems = itemsRepository.saveAll(items);
        lightenItemsUp(savedItems);

        return savedItems;
    }

    public ItemDto updateItem(ItemDto item) throws RecordNotFoundException, InvalidDataException {
        ItemDto dbItem = itemsRepository.findByCode(item.code)
            .orElseThrow(() -> new RecordNotFoundException("Item not found"));

        dbItem.description = item.description;
        dbItem.price = item.price;
        if (item.pictureUrl != null){
            downloadPicture(item);
            dbItem.picture = item.picture;
        }
        dbItem.updateTimestamp = new Date();

        return itemsRepository.save(dbItem);
    }

    private void downloadPictures(List<ItemDto> items) throws InvalidDataException {
        for (ItemDto item : items) {
            downloadPicture(item);
        }
    }

    private void downloadPicture(ItemDto item) throws InvalidDataException {
        try {
            URL url = new URL(item.pictureUrl);
            URLConnection hc = url.openConnection();
            // simulate that we're a browser to avoid restrictions for http clients
            hc.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2");
            Image image = ImageIO.read(hc.getInputStream());
            if (((BufferedImage)image).getWidth() > 300) {
                float scale = 300.0f / (float) ((BufferedImage)image).getWidth();
                Image toolkitImage = image.getScaledInstance(
                        (int) (((BufferedImage)image).getWidth() * scale),
                        (int) (((BufferedImage)image).getHeight() * scale),
                        Image.SCALE_SMOOTH);

                int width = toolkitImage.getWidth(null);
                int height = toolkitImage.getHeight(null);

                BufferedImage newImage = new BufferedImage(width, height,
                        ((BufferedImage) image).getType());
                Graphics g = newImage.getGraphics();
                g.drawImage(toolkitImage, 0, 0, null);
                g.dispose();
                image = newImage;
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write((RenderedImage) image, "jpg", baos);
            baos.flush();
            item.picture = baos.toByteArray();
            baos.close();
        } catch (IOException ex) {
            throw new InvalidDataException("Invalid picture url of item " + item.name, ex);
        }
    }

    private void calculateItemsCode(List<ItemDto> items) {
        for (ItemDto item : items) {
            item.code = SystemUtils.generateCode(item.category + item.name);
        }
    }

    private void lightenItemsUp(Iterable<ItemDto> items) {
        for(ItemDto item: items) {
            item.picture = null;
            item.pictureUrl = null;
            item.description = null;
            item.price = null;
        }
    }

    public ItemDto getItemByCode(String itemcode) throws RecordNotFoundException {
        ItemDto item = itemsRepository.findByCode(itemcode)
            .orElseThrow(() -> new RecordNotFoundException("Item not found"));

        item.itemId = null;
        return item;
    }
}
