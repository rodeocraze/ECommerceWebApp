package com.example.ECommerceApplication.Controllers;

import com.example.ECommerceApplication.Models.Product;
import com.example.ECommerceApplication.Services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        List<Product> products = service.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductByID(@PathVariable int id) {
        Product product = service.getProductByID(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {
        try {
            Product product1 = service.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product/{product_id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable int product_id) {
        try {
            Product product = service.getProductByID(product_id);
            return ResponseEntity.ok().contentType(MediaType.valueOf(product.getImageType())).body(product.getImageData());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/product/{product_id}")
    public ResponseEntity<String> updateProduct(@PathVariable int product_id, @RequestPart Product product, @RequestPart MultipartFile imageFile) {
        Product product1 = null;
        try {
            product1 = service.updateProduct(product_id, product, imageFile);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to Update", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (product1 != null) {
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to Update", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/product/{product_id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int product_id) {
        Product product = service.getProductByID(product_id);
        if (product == null) {
            return new ResponseEntity<>("Failed to find product", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        service.deleteProduct(product_id);
        return new ResponseEntity<>("Deleted product", HttpStatus.OK);
    }

    @GetMapping("/product/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = service.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products/category/{category}")
    public ResponseEntity<List<Product>> searchCategory(@PathVariable String category) {
        List<Product> products = service.searchCategory(category);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
