using AutoMapper;
using MiniECommerceApi.DTOs;
using MiniECommerceApi.Models;

namespace MiniECommerceApi.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.Product.Price));

            CreateMap<Cart, CartDto>();

            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.TechnicalSpecifications, opt => opt.MapFrom(src => src.TechnicalSpecifications));

            CreateMap<AddCartItemDto, CartItem>();
        }
    }
}
