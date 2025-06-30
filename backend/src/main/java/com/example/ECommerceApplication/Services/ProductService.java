package com.example.ECommerceApplication.Services;

import com.example.ECommerceApplication.Models.Product;
import com.example.ECommerceApplication.Repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductByID(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile image) throws IOException {
        product.setImageData(image.getBytes());
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        return repo.save(product);
    }

    public Product updateProduct(int productId, Product product, MultipartFile imageFile) throws IOException {
       product.setImageType(imageFile.getContentType());
       product.setImageName(imageFile.getOriginalFilename());
       product.setImageData(imageFile.getBytes());
       return repo.save(product);


    }

    public void deleteProduct(int productId) {
        repo.deleteById(productId);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }

    public List<Product> searchCategory(String category) {
        return repo.searchCategory(category);
    }
}
