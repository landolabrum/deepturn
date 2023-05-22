from email.policy import default
from http.client import MOVED_PERMANENTLY
from stripe.error import InvalidRequestError
import pprint
pp = pprint.PrettyPrinter(indent=4)

class Product(object):
    def __init__(self, ez):
        self.ez = ez

    def retrieve(self, id, active=True):
        context={}
        try:
            context = self.ez.stripe.Product.retrieve(id)
            # print(f"RETREIVE: {context}")
            context['price'] = []
            prices = self.ez.price.list(active=active, product=id)["data"]
            for i in prices:
                if i['product'] == id:
                    i['display']=str(i['unit_amount'])[:-2]+"."+str(i['unit_amount'])[-2:]
                    context['price'].append(i)
        except InvalidRequestError:
            context={"status": 404, "message":f"No product with ID: {id}"}
        return context

    def retrieve_all_info(self, id):
        context={}
        try:
            context = self.ez.stripe.Product.retrieve(id)
            context['price'] = []
            prices = self.ez.price.list(product=id)["data"]
            for i in prices:
                if i['product'] == id:
                    i['display']=str(i['unit_amount'])[:-2]+"."+str(i['unit_amount'])[-2:]
                    context['price'].append(i)
        except InvalidRequestError:
            context={"status": 404, "message":f"No product with ID: {id}"}
        return context

    def create(self, data):
        context={}
        images=[]
        if 'images' in data:
            images=data['images']
        # recurring, metadata, active = product_cleaner(data)
        product=self.ez.stripe.Product.create(
            name=data['name'],
            description=data['description'],
            images=images,
            metadata=data['metadata'],
        )
        context['product']=product
        if 'price' in data:
            context['product']["price"]=[]
            more=context['product']["price"]
            for i in data["price"]:
                price=self.ez.stripe.Price.create(
                    nickname=i['nickname'],
                    product=product['id'],
                    currency= "usd",
                    unit_amount=i['unit_amount']
                )
                more.append(price)
        print('context create product  \n \n', context)
        return context



    def modify(self, product=None):
        context = {}
        if 'id' in product:
            pp.pprint(product)






    def delete(self, product_id):
        context=self.ez.stripe.Product.delete(product_id)
        return context


        
    def list(self, active=None, starting_after=None):
        context=[]
        products = self.ez.stripe.Product.list(active=active, starting_after=starting_after)
        for p in products:
            price = self.ez.price.list(product=p.id)["data"]
            p['price']=price
            context.append(p)
        return {'data': context, 'has_more': products['has_more']}
        
    def list_all(self, active=True, starting_after=None):
        context=[]
        has_more=False
        query=self.ez.product.list(active=active, starting_after=starting_after)
        while True:
            products=query['data']
            has_more=query['has_more']
            if has_more == True:
                starting_after=list(products)[-1]['id']
                context+=products
                query=self.ez.product.list(active=active, starting_after=starting_after)
            else:
                context+=products
                break
        return {'data': context}

    def list_after(self, active=True, starting_after=None):
        context=[]
        query=self.ez.product.list(active=active, starting_after=starting_after)
        context=query

        # while True:
        #     products=query['data']
        #     has_more=query['has_more']
        #     if has_more == True:
        #         starting_after=list(products)[-1]['id']
        #         context+=products
        #         query=self.ez.product.list(active=active, starting_after=starting_after)
        #     else:
        #         context+=products
        #         break
        return context

    def list_category(self, active=True, starting_after=None, category=None):
        context=[]
        has_more=False
        query=self.ez.product.list(active=active, starting_after=starting_after)
        while True:
            cat=[]
            products=query['data']
            for i in products:
                if 'category' in i['metadata']:
                    mcat = i['metadata']['category']
                    if mcat == category:
                        cat.append(i)
            has_more=query['has_more']
            if has_more == True:
                starting_after=list(products)[-1]['id']
                context+=cat
                query=self.ez.product.list(active=active, starting_after=starting_after)
            else:
                context+=cat
                break
        return {'data': context}


    def list_all_admin(self,  starting_after=None):
        context=[]
        has_more=False
        query=self.ez.product.list(starting_after=starting_after)
        while True:
            products=query['data']
            has_more=query['has_more']
            if has_more == True:
                starting_after=list(products)[-1]['id']
                context+=products
                query=self.ez.product.list(starting_after=starting_after)
            else:
                context+=products
                break
        return {'data': context}





    # def modify(self, data, product_id=None):
    #     context = {}
    #     recurring, metadata, active = product_cleaner(data)
    #     if 'images' in data:
    #         context = self.ez.stripe.Product.modify(
    #             product_id,
    #             images=data['images'],
    #         )
    #     else:
    #         context = self.ez.stripe.Product.modify(
    #             product_id,
    #             active=active,
    #             metadata=metadata,
    #             name=data['name'],
    #             description=data['description'],
    #         )
    #     context['price'] = []
    #     for price_item in data['price']:
    #         if "unit_amount" in price_item and price_item['unit_amount'] != '':
    #             u_a = []
    #             if isinstance(price_item['unit_amount'], str):
    #                 query_u_a = price_item['unit_amount'].split(',')
    #                 if len(query_u_a) > 1:
    #                     for i in query_u_a:
    #                         u_a.append(int(i))
    #                 else:
    #                     u_a = query_u_a
    #             else:
    #                 u_a = [price_item['unit_amount']]
    #             prices = self.ez.price.list(product=product_id)["data"]
    #             for s in prices:
    #                 if s['product'] == product_id:
    #                     if s['unit_amount'] in u_a and s['active']:
    #                         u_a.remove(s['unit_amount'])
    #                     elif s['unit_amount'] in u_a and s['active'] == False:
    #                         self.ez.stripe.Price.modify(s['id'], active=active)
    #                         u_a.remove(s['unit_amount'])
    #                     elif s['unit_amount'] not in u_a and s['active'] == True:
    #                         self.ez.stripe.Price.modify(s['id'], active=False)
    #             if len(u_a) >= 1:
    #                 for n in u_a:
    #                     if isinstance(n, str):
    #                         n = int(n)
    #                     created = self.ez.price.create({
    #                         "active": active,
    #                         "unit_amount": n,
    #                         "recurring": recurring,
    #                         "product": product_id,
    #                     })
    #                     created['display'] = n*.01
    #                     context['price'].append(dict(created))
    #     else:
    #         context['price'] = self.ez.price.list(
    #             product=product_id, active=True)["data"]
    #     return context

    # def delete(self, product_id):
    #     context=self.ez.stripe.Product.delete(product_id)
    #     return context






    # def list_all(self, active=True, starting_after=None):
    #     context={}
    #     has_more=False
    #     query=self.ez.product.list(active=active, starting_after=starting_after)
    #     while True:
    #         products=query.data
    #         has_more=query['has_more']
    #         if has_more == True:
    #             starting_after=list(products)[-1]['id']
    #             for p in products: 
    #                 # IF NO CATEGORY DO NOT ADD TO PRODUCT LISTINGS
    #                 try:
    #                     category=p.metadata.category
    #                     price = self.ez.price.list(product=p.id)["data"]
    #                     p["display"] = price[0]['unit_amount_decimal']
    #                     if category in context:
    #                         context[category].append(p)
    #                     else:
    #                         if category != "membership":
    #                             context.update({category:[p]})
    #                 except:
    #                     pass
    #             query=self.ez.product.list(active=active, starting_after=starting_after)
    #         else:
    #             starting_after=list(products)[-1]['id']
    #             for p in products:
    #                 p["display"] = self.ez.price.list(product=p.id)["data"][0]['unit_amount_decimal']
    #                 if 'category' in p:
    #                     category=p.metadata.category
    #                     if category in context:
    #                         context[category].append(p)
    #                     else:
    #                         if category != "membership":
    #                             context.update({category:[p]})
    #             return context