#include <includes.hpp>

std::uint32_t main()
{
	std::printf("https://github.com/justvmexit/authentication example\n\n");

	std::string license;
	std::printf("enter license: ");
	std::getline(std::cin, license);

	auth::response_ctx response = auth::authenticate(license);
	if (response.succeeded())
	{
		std::printf("welcome back!\nlicenses expiry: %s\n", response.license().expiry().c_str());

		std::printf("preparing streaming procedure\n");
		auth::session_ctx session = response.session();
		std::printf("streaming image..\n");
		auth::secure_image image = session.stream();
		std::printf("finished streaming image..\n");
		std::printf("starting decryption of image..\n");
		std::vector<std::uint32_t> raw_image = image.set_key(
			response.license().deriveKey()
			).decrypt();
		std::printf("decrypted image (%dkb)\n", raw_image.size() / 1000);

		for (char c : raw_image)
			std::printf("%c", c);

		std::printf("streaming finished..\n");
		std::cin.get();
	}
}
